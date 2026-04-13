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

export default function HeatingCostPerSquareFootCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    pricePerSqFt: "",
    waste: "10",
    materialType: "electric", // electric, hydronic, or radiant
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const SQFT_PER_SQM = 10.7639;

  // Material cost multipliers or base costs per sq ft (example values)
  // These could be adjusted or expanded with more precise data
  const materialBaseCosts: Record<string, number> = {
    electric: 12, // $12 per sq ft average installation cost
    hydronic: 18, // $18 per sq ft average installation cost
    radiant: 15, // $15 per sq ft average installation cost
  };

  // Calculate results
  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    let priceNum = parseFloat(inputs.pricePerSqFt);

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25
    ) {
      return {
        mainQty: "0 sq ft",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate area in square feet
    let areaSqFt = 0;
    if (inputs.unit === "metric") {
      // Inputs are in meters, convert to sq ft
      areaSqFt = lengthNum * widthNum * SQFT_PER_SQM;
    } else {
      // Inputs are in feet
      areaSqFt = lengthNum * widthNum;
    }

    // Add waste margin
    const totalAreaWithWaste = areaSqFt * (1 + wastePercent / 100);

    // Determine price per sq ft if not provided, fallback to base cost by material type
    if (isNaN(priceNum) || priceNum <= 0) {
      priceNum = materialBaseCosts[inputs.materialType] || 15;
    }

    // Calculate total cost
    const totalCost = totalAreaWithWaste * priceNum;

    // Format results
    return {
      mainQty: `${totalAreaWithWaste.toFixed(2)} sq ft`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Base area: ${areaSqFt.toFixed(
        2
      )} sq ft + ${wastePercent}% waste margin`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is heating cost per square foot and why does it matter?",
      answer: "Heating cost per square foot is the annual expense to heat your building divided by its total square footage, typically ranging from $0.50 to $3.00 per square foot depending on climate and efficiency. This metric helps property owners and builders benchmark their heating expenses against regional averages and identify opportunities for energy savings or system upgrades.",
    },
    {
      question: "How do I calculate my heating cost per square foot?",
      answer: "Divide your total annual heating costs (in dollars) by your building's total square footage. For example, if you spend $4,800 annually on heating a 2,000 sq ft home, your cost per square foot is $2.40. This calculator automates this division and helps you compare against regional benchmarks.",
    },
    {
      question: "What factors most significantly affect heating cost per square foot?",
      answer: "Climate zone, insulation quality, heating system type, fuel source (natural gas, oil, electric heat pump), and building age are the primary drivers. A home in Minnesota with poor insulation may cost $2.50–$3.50 per square foot annually, while the same home in Florida might cost $0.50–$1.00 per square foot due to minimal heating needs.",
    },
    {
      question: "What is the average heating cost per square foot across the United States?",
      answer: "The national average ranges from $1.00 to $2.00 per square foot annually, with significant regional variation. Northern states like Maine, New York, and Wisconsin average $2.00–$3.00 per square foot, while southern states like Texas and Florida average $0.50–$1.00 per square foot.",
    },
    {
      question: "How does natural gas compare to heating oil in cost per square foot?",
      answer: "Natural gas typically costs $0.80–$1.50 per square foot annually, while heating oil can cost $1.50–$2.50 per square foot in the same climate zone, making gas 30–50% cheaper on average. However, oil prices fluctuate more dramatically with global crude prices, while natural gas pricing is more stable.",
    },
    {
      question: "Can improving insulation reduce my heating cost per square foot?",
      answer: "Yes, upgrading insulation can reduce heating costs by 10–20%, lowering your per-square-foot metric by $0.10–$0.40 depending on current insulation levels and climate. Adding attic insulation, sealing air leaks, and upgrading to double-pane windows are among the most cost-effective improvements.",
    },
    {
      question: "What is considered a good heating cost per square foot?",
      answer: "In cold climates, $1.50–$2.00 per square foot is considered good; in moderate climates, $0.75–$1.25 is typical; in mild climates, $0.25–$0.75 is average. If your number is 20% higher than your region's average, it may indicate inefficiency worth addressing.",
    },
    {
      question: "How do modern heat pumps affect heating cost per square foot?",
      answer: "Heat pumps can reduce heating costs by 30–50% compared to electric resistance heating, potentially lowering your per-square-foot cost from $2.00 to $1.00–$1.40 depending on climate. However, they perform best in moderate climates and may require supplemental heating in regions with temperatures consistently below 20°F.",
    },
    {
      question: "Should I use this calculator to estimate costs for a new construction project?",
      answer: "Yes, this calculator helps estimate operational heating costs for new builds by comparing against regional benchmarks for similar square footage and climate zone. For new construction, assume higher efficiency ratings (R-values &gt; 20 in attics, &gt; 15 in walls) which can lower costs by 25–40% compared to older homes.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing an electric underfloor heating system in a 5 meter by 4 meter room. You want to include a 10% waste margin and know the price per square foot is $13.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert 5m x 4m to square feet: 5 × 4 × 10.7639 = 215.28 sq ft",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 215.28 × 1.10 = 236.81 sq ft total material needed",
      },
      {
        label: "3. Calculate Cost",
        explanation:
          "Multiply total sq ft by price per sq ft: 236.81 × $13 = $3,078.53 estimated cost",
      },
    ],
    result: "Final Order: 236.81 sq ft of electric heating material costing $3,078.53",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Material (sq ft) = Length × Width × Conversion Factor × (1 + Waste Percentage)",
    variables: [
      { symbol: "Length", description: "Length of the area (meters or feet)" },
      { symbol: "Width", description: "Width of the area (meters or feet)" },
      {
        symbol: "Conversion Factor",
        description:
          "10.7639 if input is in meters (to convert to sq ft), 1 if in feet",
      },
      {
        symbol: "Waste Percentage",
        description:
          "Additional percentage of material to account for waste (expressed as decimal)",
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
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Heating Material Type</Label>
          <Select
            value={inputs.materialType}
            onValueChange={(v) => handleInputChange("materialType", v)}
          >
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electric">Electric Heating</SelectItem>
              <SelectItem value="hydronic">Hydronic Heating</SelectItem>
              <SelectItem value="radiant">Radiant Panels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Square Foot (optional)</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.pricePerSqFt}
              onChange={(e) => handleInputChange("pricePerSqFt", e.target.value)}
              placeholder={`Default used if empty`}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin (%)</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Heating Cost per Square Foot Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Heating Cost per Square Foot Estimator is a tool designed to help property owners, real estate professionals, and builders understand and benchmark their annual heating expenses relative to their building's size. Whether you're evaluating the energy efficiency of an existing property or projecting operational costs for a new construction project, this calculator standardizes heating costs into a per-square-foot metric that enables meaningful comparisons across regions, climates, and building types.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need three key inputs: your total annual heating costs (in dollars), your building's total square footage, and ideally your climate zone or location. Your annual heating cost can come from utility bills, fuel delivery receipts, or energy audits; if you don't have exact figures, you can estimate based on monthly bills. The calculator divides total annual costs by square footage and compares the result against regional and national benchmarks to show you whether your heating expenses are above, at, or below average.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The output provides your heating cost per square foot alongside regional averages and recommendations for improvement. A result 20% higher than your regional benchmark may indicate poor insulation, an aging system, or inefficient operation, while results 15–20% below average suggest above-average efficiency. Use this information to prioritize energy upgrades (such as insulation improvements or system replacements), negotiate property prices, or set realistic utility budgets for new construction.</p>
        </div>
      </section>

      {/* TABLE: Average Heating Cost per Square Foot by Climate Zone (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Heating Cost per Square Foot by Climate Zone (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical annual heating expenses per square foot across five major U.S. climate zones.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Winter Temp (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Natural Gas ($/sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heating Oil ($/sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electric Heat ($/sq ft)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Cold (Zone 1)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 0°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00–$2.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.20–$3.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.50–$3.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold (Zone 2)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0°F to 20°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$2.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.70–$2.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.80–$2.60</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate (Zone 3)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20°F to 35°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00–$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.20–$1.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.10–$1.70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild (Zone 4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35°F to 50°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.60–$1.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.80–$1.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.70–$1.20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warm (Zone 5)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Above 50°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.20–$0.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.40–$0.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30–$0.70</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary based on fuel availability, local utility rates, and building efficiency. Figures assume standard insulation levels (R-13 walls, R-19 attics). Data from U.S. Energy Information Administration.</p>
      </section>

      {/* TABLE: Heating System Type and Associated Per-Square-Foot Costs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Heating System Type and Associated Per-Square-Foot Costs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different heating systems have varying operational efficiencies that directly impact your cost per square foot.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heating System Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">AFUE Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost per Sq Ft (Moderate Climate)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Lifespan (Years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oil Furnace (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.40–$1.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oil Furnace (High-Efficiency)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90–95%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.20–$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Natural Gas Furnace (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00–$1.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Natural Gas Furnace (High-Efficiency)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.85–$1.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Heat Pump (Air-Source)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–400% COP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.90–$1.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Baseboard (Resistance)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ground Source Heat Pump</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–600% COP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.70–$1.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">AFUE = Annual Fuel Utilization Efficiency; COP = Coefficient of Performance. Costs are in 2024–2025 dollars for moderate climates with standard insulation.</p>
      </section>

      {/* TABLE: Impact of Insulation and Building Age on Heating Cost per Square Foot */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Insulation and Building Age on Heating Cost per Square Foot</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Insulation levels and building age are critical factors that determine the efficiency of your heating system.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Building Age / Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Insulation Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Natural Gas Cost (Cold Climate)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Potential Savings via Upgrade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pre-1980 (Poor)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-0 to R-5 walls, R-5 attic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.40–$3.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–40%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1980–2000 (Fair)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-5 to R-10 walls, R-11 attic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.80–$2.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2000–2010 (Good)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-11 to R-15 walls, R-19 attic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.30–$1.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2010–Present (Excellent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-15–R-20 walls, R-30–R-49 attic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.90–$1.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New Construction (R-2000 Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-20+ walls, R-49+ attic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.75–$1.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Figures assume natural gas heating in cold climates (&lt;20°F average winter temperatures). Improvements include air sealing, insulation upgrades, and window replacement.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Collect 12 months of heating bills before calculating to ensure you capture seasonal variation and one complete heating cycle; using only winter months will overstate your annual cost per square foot.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include only direct heating costs (furnace, boiler, heat pump operation, fuel delivery) and exclude water heating, cooling, and lighting to get an accurate per-square-foot metric for heating specifically.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your result against your climate zone's average, not the national average; a heating cost of $2.00 per square foot may be excellent in Minnesota but unusually high in Florida.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Document your building's insulation levels, system age, and fuel type when calculating; this context helps you understand whether your cost per square foot reflects normal wear or indicates a need for upgrades.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate annually after making efficiency improvements (insulation upgrades, system replacement, air sealing) to quantify your energy savings and return on investment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for square footage accurately by including only heated spaces; calculating cost per square foot for unheated attics, crawlspaces, or detached garages will artificially inflate your per-square-foot cost.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including Non-Heating Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing heating expenses with water heating, cooling, or electrical costs inflates your per-square-foot metric and makes comparisons unreliable. Isolate only furnace, boiler, or heat pump fuel and operation costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Only Winter Months</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating cost per square foot from November–February data excludes spring and fall shoulder seasons when heating still occurs, artificially inflating your annual estimate by 15–25%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Regional Climate Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Comparing your $1.50 per-square-foot cost to a national average of $1.30 without accounting for climate zones is misleading; $1.50 may be normal in a very cold climate but high in a mild one.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including Unheated Square Footage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dividing heating costs by total building area including basements, detached garages, or unheated attics distorts your metric; count only actively heated, conditioned spaces.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for One-Time Expenses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Including system repair or replacement costs in a single year's heating bill overstates your operational cost per square foot; separate capital expenses from annual operating costs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is heating cost per square foot and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heating cost per square foot is the annual expense to heat your building divided by its total square footage, typically ranging from $0.50 to $3.00 per square foot depending on climate and efficiency. This metric helps property owners and builders benchmark their heating expenses against regional averages and identify opportunities for energy savings or system upgrades.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my heating cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your total annual heating costs (in dollars) by your building's total square footage. For example, if you spend $4,800 annually on heating a 2,000 sq ft home, your cost per square foot is $2.40. This calculator automates this division and helps you compare against regional benchmarks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors most significantly affect heating cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Climate zone, insulation quality, heating system type, fuel source (natural gas, oil, electric heat pump), and building age are the primary drivers. A home in Minnesota with poor insulation may cost $2.50–$3.50 per square foot annually, while the same home in Florida might cost $0.50–$1.00 per square foot due to minimal heating needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average heating cost per square foot across the United States?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The national average ranges from $1.00 to $2.00 per square foot annually, with significant regional variation. Northern states like Maine, New York, and Wisconsin average $2.00–$3.00 per square foot, while southern states like Texas and Florida average $0.50–$1.00 per square foot.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does natural gas compare to heating oil in cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Natural gas typically costs $0.80–$1.50 per square foot annually, while heating oil can cost $1.50–$2.50 per square foot in the same climate zone, making gas 30–50% cheaper on average. However, oil prices fluctuate more dramatically with global crude prices, while natural gas pricing is more stable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can improving insulation reduce my heating cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, upgrading insulation can reduce heating costs by 10–20%, lowering your per-square-foot metric by $0.10–$0.40 depending on current insulation levels and climate. Adding attic insulation, sealing air leaks, and upgrading to double-pane windows are among the most cost-effective improvements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a good heating cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In cold climates, $1.50–$2.00 per square foot is considered good; in moderate climates, $0.75–$1.25 is typical; in mild climates, $0.25–$0.75 is average. If your number is 20% higher than your region's average, it may indicate inefficiency worth addressing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do modern heat pumps affect heating cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heat pumps can reduce heating costs by 30–50% compared to electric resistance heating, potentially lowering your per-square-foot cost from $2.00 to $1.00–$1.40 depending on climate. However, they perform best in moderate climates and may require supplemental heating in regions with temperatures consistently below 20°F.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator to estimate costs for a new construction project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator helps estimate operational heating costs for new builds by comparing against regional benchmarks for similar square footage and climate zone. For new construction, assume higher efficiency ratings (R-values &gt; 20 in attics, &gt; 15 in walls) which can lower costs by 25–40% compared to older homes.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/consumption/residential/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Heating Fuel Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government source for residential heating cost and consumption data by region and fuel type.</p>
          </li>
          <li>
            <a href="https://www.energystar.gov/homeowners/home-energy-audit-assessment" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ENERGY STAR - Home Energy Assessment Tools</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA-backed resources and tools for evaluating building efficiency and estimating heating system performance.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/weatherization/weatherization-assistance-program" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Department of Energy - Weatherization Assistance Program</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal program data on heating cost reduction through insulation and efficiency upgrades, including savings benchmarks.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/advocacy-and-legal/construction-codes-and-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders - Building Science Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and research on insulation levels, heating system efficiency, and cost comparisons by climate zone.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heating Cost per Square Foot Estimator"
      description="The ultimate professional guide and calculator for Heating Cost per Square Foot Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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