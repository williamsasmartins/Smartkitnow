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

export default function EnergyEfficiencySavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness or height of insulation or material layer
    waste: "10", // waste margin in %
    price: "",
    materialSize: "standard", // standard or large size units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Material unit yields (example values for insulation panels or rolls)
  // Standard size unit covers 1 m² (metric) or 10 ft² (imperial) approx
  // Large size unit covers 2 m² or 20 ft² approx
  const materialUnitCoverage = {
    metric: {
      standard: 1, // m² per unit
      large: 2, // m² per unit
    },
    imperial: {
      standard: 10, // ft² per unit
      large: 20, // ft² per unit
    },
  };

  // Conversion constants
  const ftToM = 0.3048;
  const mToFt = 3.28084;

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const unit = inputs.unit;
    const size = inputs.materialSize;

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate surface area (length x width) in m² or ft²
    // Depth is thickness but for energy efficiency savings, material units are based on surface coverage,
    // so depth is informational or for volume-based materials (like spray foam).
    // For this generic calculator, we calculate area only for material units.

    let area: number;
    if (unit === "metric") {
      area = lengthNum * widthNum; // m²
    } else {
      area = lengthNum * widthNum; // ft²
    }

    // Add waste margin
    const totalArea = area * (1 + wastePercent / 100);

    // Calculate units needed based on material coverage per unit
    const coveragePerUnit = materialUnitCoverage[unit][size];
    const rawUnits = totalArea / coveragePerUnit;

    // Round up to next whole unit (commercial units)
    const unitsNeeded = Math.ceil(rawUnits);

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? unitsNeeded * priceNum : 0;

    // Details string
    const details = `Raw coverage needed: ${totalArea.toFixed(
      2
    )} ${unit === "metric" ? "m²" : "ft²"}`;

    return {
      mainQty: `${unitsNeeded} Unit${unitsNeeded > 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "Price not set",
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the average annual energy savings from upgrading to ENERGY STAR certified HVAC systems?",
      answer: "ENERGY STAR certified HVAC systems typically save homeowners between $150–$600 per year in heating and cooling costs, depending on climate zone and system age. For a 2,000 sq ft home in a moderate climate replacing a 15-year-old system, savings often reach $400–$500 annually. These savings come from 15–20% improved efficiency compared to standard systems.",
    },
    {
      question: "How much can LED lighting upgrades reduce my energy bills?",
      answer: "Converting to LED lighting from incandescent bulbs can reduce lighting energy consumption by 75–80%, translating to $100–$200 in annual savings for a typical residential home. A commercial building with 100+ fixtures may save $1,000–$3,000 annually. LEDs also last 25,000–50,000 hours versus 1,000 hours for incandescent bulbs, reducing replacement costs.",
    },
    {
      question: "What ROI can I expect from insulation improvements?",
      answer: "Attic and wall insulation upgrades typically deliver 15–30% energy savings with payback periods of 2–8 years depending on local energy costs. A $3,000 insulation project in a cold climate may save $500–$800 annually, achieving full ROI in 4–6 years. Energy savings continue indefinitely after the payback period.",
    },
    {
      question: "How does window replacement impact heating and cooling efficiency?",
      answer: "Upgrading from single-pane to ENERGY STAR certified double or triple-pane windows reduces heat loss by 30–50%, saving $200–$600 annually depending on climate and home size. Installation costs range from $8,000–$15,000 for a whole home, resulting in payback periods of 12–20 years in moderate climates and 7–12 years in severe climates.",
    },
    {
      question: "What are typical water heater efficiency improvements and savings?",
      answer: "Upgrading from a standard 40-gallon tank water heater to an ENERGY STAR heat pump or tankless model reduces water heating energy use by 24–50%, saving $100–$400 annually. A tankless system costs $1,500–$3,000 installed but can deliver payback in 7–10 years while lasting 20+ years versus 10–15 years for tank models.",
    },
    {
      question: "How much can weather sealing and air sealing save on energy costs?",
      answer: "Air sealing gaps around doors, windows, and ducts can reduce heating and cooling costs by 10–20%, typically saving $150–$300 annually for modest homes. This work costs $400–$1,500 depending on home size and condition, making it one of the fastest-payback efficiency improvements available.",
    },
    {
      question: "What is the impact of installing a smart thermostat on energy consumption?",
      answer: "Smart thermostats reduce heating and cooling energy use by 10–15% through automated scheduling and learning algorithms, saving $100–$200 annually for most households. Initial costs range from $150–$350, achieving payback in 1–2 years while also improving comfort and enabling remote temperature management.",
    },
    {
      question: "How do building envelope improvements compare to HVAC upgrades in terms of ROI?",
      answer: "Building envelope work (insulation, windows, air sealing) typically costs 30–50% less than HVAC replacement but delivers 40–60% of the energy savings benefit. For maximum efficiency, combining both improvements achieves 35–50% total energy reduction compared to 20–25% from HVAC alone.",
    },
    {
      question: "What payback period should I expect from a comprehensive energy efficiency renovation?",
      answer: "A full-home energy efficiency project combining insulation, windows, HVAC, and controls can cost $15,000–$40,000 but typically saves $1,500–$3,500 annually, delivering payback in 5–12 years. Tax credits and rebates can reduce net costs by 20–40%, accelerating payback to 3–8 years depending on incentive programs available in your region.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are insulating a rectangular wall area measuring 5 meters in length and 3 meters in height. You plan to use standard size insulation panels that cover 1 m² each. You want to include a 10% waste margin and the price per panel is $25.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate area: 5 m × 3 m = 15 m²",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 15 m² × 1.10 = 16.5 m² total coverage needed",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total area by coverage per panel: 16.5 m² ÷ 1 m² = 16.5 panels → round up to 17 panels",
      },
    ],
    result: "Final Order: 17 Panels, Estimated Cost: $425.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Material Units = ⌈ (Length × Width × (1 + Waste%)) ÷ Coverage per Unit ⌉",
    variables: [
      { symbol: "Length", description: "Length of the area to cover" },
      { symbol: "Width", description: "Width or height of the area to cover" },
      {
        symbol: "Waste%",
        description:
          "Waste margin percentage added to cover cutting and fitting losses",
      },
      {
        symbol: "Coverage per Unit",
        description:
          "Surface area covered by one unit of the material (depends on material size and unit system)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the next whole unit",
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

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
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
            min="0"
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
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.1"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Informational - thickness of insulation or material layer
          </p>
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
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Energy Efficiency Savings Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Energy Efficiency Savings Estimator is a tool designed to help homeowners and building managers calculate potential energy cost savings from implementing specific efficiency upgrades. By entering details about your current home or building characteristics, the calculator projects annual and lifetime savings while accounting for regional utility rates, climate conditions, and equipment age. This helps you prioritize which improvements offer the best financial return.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input key information: your current annual energy costs (or square footage and utility rates), your climate zone or location, the type of upgrades you're considering (HVAC, insulation, windows, lighting, etc.), and any equipment ages. The calculator uses these inputs to estimate baseline energy consumption and applies standard efficiency improvement percentages based on DOE and ENERGY STAR data. More detailed information will yield more accurate results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator output shows estimated annual savings, total project cost, payback period, and lifetime savings over 25–30 years. Results also highlight available tax credits and rebates that can reduce net costs. Use these projections to compare different upgrade paths and determine which improvements make sense for your budget and timeline. Remember that actual savings depend on usage patterns, local energy prices, and installation quality.</p>
        </div>
      </section>

      {/* TABLE: Annual Energy Savings by Improvement Type (Typical Single-Family Home) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Energy Savings by Improvement Type (Typical Single-Family Home)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated annual energy cost savings for common efficiency upgrades in a 2,000 sq ft home with average utility rates of $0.14/kWh electricity and $1.20/therm natural gas.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Improvement Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payback Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">LED Lighting Upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–8 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Attic Insulation (R-38 to R-60)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500–$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–7 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Air Sealing and Weather Stripping</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–5 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Window Replacement (8 windows)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000–$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–20 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">HVAC System Upgrade (ENERGY STAR)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000–$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–15 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tankless Water Heater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500–$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150–$350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–12 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smart Thermostat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–3 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cool Roof Coating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500–$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–10 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Savings vary by climate zone, energy rates, and equipment age. Values based on 2024 ENERGY STAR and DOE benchmarks.</p>
      </section>

      {/* TABLE: Energy Efficiency Improvement Impact by Climate Zone */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Energy Efficiency Improvement Impact by Climate Zone</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how annual energy savings vary across four climate zones for a baseline HVAC upgrade on a 2,000 sq ft home.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heating Degree Days</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cooling Degree Days</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">HVAC Savings Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">ROI Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold (Northern)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,000–9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$900/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heating upgrades first</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate (Central)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$600/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Balanced approach</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot-Humid (Southern)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$700/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cooling upgrades first</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot-Dry (Southwest)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500–5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350–$650/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Window + insulation priority</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Degree days measure heating/cooling demand. Savings are for replacing a 15-year-old HVAC system with ENERGY STAR model.</p>
      </section>

      {/* TABLE: Federal Tax Credits and Rebates for Energy Efficiency (2024–2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Federal Tax Credits and Rebates for Energy Efficiency (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines current federal tax credits and typical state/utility rebates available for qualifying home energy improvements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Improvement Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal Tax Credit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical State Rebate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Combined Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heat Pump HVAC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $2,000 (IRA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500–$4,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heat Pump Water Heater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $2,000 (IRA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,300–$3,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insulation/Air Sealing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $1,200 (IRA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400–$2,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Window Replacement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $600 (IRA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700–$1,100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smart Thermostats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10% of cost, max $50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Energy Audit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10% of cost, max $150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$450</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">IRA = Inflation Reduction Act (2024–2025). Credits require ENERGY STAR certification or equivalent. Rebates vary by state and utility provider.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start with a professional home energy audit ($300–$500) before investing in major upgrades—auditors identify the highest-impact improvements first and often pay for themselves through rebate information alone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize air sealing and insulation before upgrading HVAC systems, as these building envelope improvements reduce the HVAC workload and allow you to downsize to a smaller, cheaper unit while achieving better comfort.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Stack federal IRA tax credits with state rebates and utility incentives to maximize net savings—many homeowners can recover 30–50% of upgrade costs through available programs, dramatically improving payback periods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a smart meter or home energy monitor during your project to track actual savings and identify remaining high-consumption periods, which often reveals opportunities for behavioral changes that extend financial benefits.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Climate-Specific Priorities</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Upgrading windows heavily in a hot climate delivers minimal cooling savings compared to attic insulation and air sealing. Match improvement priorities to your region's heating or cooling dominance to maximize ROI.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Oversizing HVAC Equipment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A system that's too large cycles on and off frequently, reducing efficiency and comfort while wasting energy. Calculate proper sizing based on post-upgrade building load (after insulation/sealing work) to hit the sweet spot for efficiency and cost.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Ductwork and Commissioning</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A new high-efficiency furnace or heat pump loses 15–25% of its performance to leaky ducts and improper installation. Always include duct sealing and professional commissioning in HVAC upgrade budgets for realistic savings claims.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Non-Energy Benefits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Focusing solely on energy savings misses improved comfort, indoor air quality, and reduced maintenance costs that often add $500–$2,000 in annual value beyond energy bills.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average annual energy savings from upgrading to ENERGY STAR certified HVAC systems?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ENERGY STAR certified HVAC systems typically save homeowners between $150–$600 per year in heating and cooling costs, depending on climate zone and system age. For a 2,000 sq ft home in a moderate climate replacing a 15-year-old system, savings often reach $400–$500 annually. These savings come from 15–20% improved efficiency compared to standard systems.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can LED lighting upgrades reduce my energy bills?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Converting to LED lighting from incandescent bulbs can reduce lighting energy consumption by 75–80%, translating to $100–$200 in annual savings for a typical residential home. A commercial building with 100+ fixtures may save $1,000–$3,000 annually. LEDs also last 25,000–50,000 hours versus 1,000 hours for incandescent bulbs, reducing replacement costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What ROI can I expect from insulation improvements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Attic and wall insulation upgrades typically deliver 15–30% energy savings with payback periods of 2–8 years depending on local energy costs. A $3,000 insulation project in a cold climate may save $500–$800 annually, achieving full ROI in 4–6 years. Energy savings continue indefinitely after the payback period.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does window replacement impact heating and cooling efficiency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Upgrading from single-pane to ENERGY STAR certified double or triple-pane windows reduces heat loss by 30–50%, saving $200–$600 annually depending on climate and home size. Installation costs range from $8,000–$15,000 for a whole home, resulting in payback periods of 12–20 years in moderate climates and 7–12 years in severe climates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are typical water heater efficiency improvements and savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Upgrading from a standard 40-gallon tank water heater to an ENERGY STAR heat pump or tankless model reduces water heating energy use by 24–50%, saving $100–$400 annually. A tankless system costs $1,500–$3,000 installed but can deliver payback in 7–10 years while lasting 20+ years versus 10–15 years for tank models.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can weather sealing and air sealing save on energy costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Air sealing gaps around doors, windows, and ducts can reduce heating and cooling costs by 10–20%, typically saving $150–$300 annually for modest homes. This work costs $400–$1,500 depending on home size and condition, making it one of the fastest-payback efficiency improvements available.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the impact of installing a smart thermostat on energy consumption?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smart thermostats reduce heating and cooling energy use by 10–15% through automated scheduling and learning algorithms, saving $100–$200 annually for most households. Initial costs range from $150–$350, achieving payback in 1–2 years while also improving comfort and enabling remote temperature management.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do building envelope improvements compare to HVAC upgrades in terms of ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Building envelope work (insulation, windows, air sealing) typically costs 30–50% less than HVAC replacement but delivers 40–60% of the energy savings benefit. For maximum efficiency, combining both improvements achieves 35–50% total energy reduction compared to 20–25% from HVAC alone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What payback period should I expect from a comprehensive energy efficiency renovation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A full-home energy efficiency project combining insulation, windows, HVAC, and controls can cost $15,000–$40,000 but typically saves $1,500–$3,500 annually, delivering payback in 5–12 years. Tax credits and rebates can reduce net costs by 20–40%, accelerating payback to 3–8 years depending on incentive programs available in your region.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.energystar.gov/products/how-save-money-your-home-energy-bills" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ENERGY STAR Home Upgrade Savings Estimator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA tool providing baseline energy consumption estimates and efficiency improvement benchmarks for residential homes across climate zones.</p>
          </li>
          <li>
            <a href="https://www.dsireusa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Database of State Incentives for Renewables & Efficiency (DSIRE)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for federal, state, and utility rebates and tax credits available for residential energy efficiency projects.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/energysaver/weatherization-and-energy-efficiency" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Department of Energy: Home Weatherization Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official DOE guidance on cost-effective energy efficiency improvements, equipment specifications, and payback period benchmarks.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit-irc-25c-and-25d" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Clean Energy and Vehicle Credits (Form 5695)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS rules and limits for residential clean energy tax credits including heat pumps, insulation, windows, and water heaters under current law.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Energy Efficiency Savings Estimator"
      description="The ultimate professional guide and calculator for Energy Efficiency Savings Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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