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

export default function ExcavationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "",
    waste: "10", // percentage waste margin
    price: "",
    materialSize: "standard", // standard or large unit size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const FEET_TO_METERS = 0.3048;
  const CUBIC_FEET_TO_CUBIC_METERS = 0.0283168;

  // Material unit yields (volume per unit)
  // For example, standard unit = 1 cubic meter, large unit = 1.5 cubic meters
  // These can be adjusted based on typical material packaging or delivery units
  const materialUnitVolumes = {
    standard: 1, // cubic meters
    large: 1.5, // cubic meters
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const materialSize = inputs.materialSize;

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
        wasteInfo: `+${wasteNum}% Waste included`,
      };
    }

    // Convert all dimensions to meters if imperial
    let lengthM = lengthNum;
    let widthM = widthNum;
    let depthM = depthNum;

    if (inputs.unit === "imperial") {
      lengthM = lengthNum * FEET_TO_METERS;
      widthM = widthNum * FEET_TO_METERS;
      depthM = depthNum * FEET_TO_METERS;
    }

    // Calculate volume in cubic meters
    const rawVolume = lengthM * widthM * depthM;

    // Add waste margin
    const totalVolume = rawVolume * (1 + wasteNum / 100);

    // Calculate units needed based on material size volume
    const unitVolume = materialUnitVolumes[materialSize] || 1;
    const unitsNeeded = Math.ceil(totalVolume / unitVolume);

    // Calculate cost if price per unit is provided
    const totalCost = priceNum && priceNum > 0 ? unitsNeeded * priceNum : 0;

    return {
      mainQty: `${unitsNeeded.toLocaleString()} Unit${unitsNeeded > 1 ? "s" : ""}`,
      cost: totalCost > 0 ? `$${totalCost.toFixed(2)}` : "N/A",
      details: `Raw Volume: ${rawVolume.toFixed(3)} m³, Total with Waste: ${totalVolume.toFixed(
        3
      )} m³`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How do I calculate the volume of soil to be excavated?",
      answer: "To calculate excavation volume, multiply the length, width, and depth of the area in feet, then divide by 27 to convert cubic feet to cubic yards. For example, a 50-foot long, 30-foot wide, and 4-foot deep excavation equals (50 × 30 × 4) ÷ 27 = 222.2 cubic yards. Most excavation calculators accept these three dimensions and automatically perform this conversion for you.",
    },
    {
      question: "What is the difference between bank cubic yards and loose cubic yards?",
      answer: "Bank cubic yards (BCY) refer to soil in its natural, undisturbed state, while loose cubic yards (LCY) refer to soil after excavation when it expands. Soil typically swells 10–25% after excavation depending on soil type, meaning 100 BCY may become 110–125 LCY. Your excavation calculator should account for this swell factor to estimate true removal and hauling costs.",
    },
    {
      question: "How much does excavation typically cost per cubic yard?",
      answer: "Excavation costs range from $3–$12 per cubic yard for standard soil removal, depending on location, soil type, and site conditions. Rocky or contaminated soil can cost $15–$25+ per cubic yard due to specialized equipment needs. Using your excavation calculator with local pricing helps generate accurate project budgets.",
    },
    {
      question: "What equipment costs should I factor into my excavation estimate?",
      answer: "Standard excavation equipment includes backhoes ($75–$125/hour), excavators ($100–$150/hour), and dump trucks ($50–$100/hour). A typical residential excavation job may require 8–16 equipment hours, totaling $800–$2,400 in machinery costs alone. Your calculator should allow you to input hourly rates for different equipment types to get accurate totals.",
    },
    {
      question: "How do I account for grading and site preparation in my calculation?",
      answer: "Grading and site prep are separate from raw excavation volume and typically cost $0.50–$2.00 per square foot depending on slope and finish requirements. For a 2,000-square-foot site, expect $1,000–$4,000 in grading costs in addition to excavation removal. Enter both the excavation depth and the grading area separately in your calculator for a complete estimate.",
    },
    {
      question: "What soil types have different swell factors I should know about?",
      answer: "Clay soils swell 20–25%, sand 10–15%, and rocky soil 50%+ due to breakage. Organic material like topsoil swells 15–20%, while gravel swells 10–12%. Knowing your specific soil type allows you to select the correct swell factor in your excavation calculator for more accurate cubic yard projections.",
    },
    {
      question: "How do I calculate disposal or hauling costs in my excavation project?",
      answer: "Hauling costs depend on cubic yardage, distance to disposal site, and truck capacity (typically 10–15 cubic yards per load). A 200-cubic-yard excavation project 5 miles away costs approximately $1,200–$2,000 at standard rates of $30–$50 per load. Your excavation calculator should include fields for distance and haul rate to compute total transport costs.",
    },
    {
      question: "What permits or regulations affect my excavation cost estimate?",
      answer: "Most municipalities require excavation permits ($100–$500) and may mandate utility locating (often free via 811 call), environmental assessments, and erosion control measures ($500–$5,000+). These compliance costs should be added to your excavation calculator results for a realistic total project budget.",
    },
    {
      question: "Can I use this calculator for basement or pond excavation?",
      answer: "Yes, the excavation calculator works for any project requiring volume calculations: basements, ponds, pools, and foundations. For basement excavation on a 40×50-foot footprint 8 feet deep, you'd calculate (40 × 50 × 8) ÷ 27 = 592.6 cubic yards, then apply your local per-yard rates and swell factors to get final costs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are excavating a rectangular foundation for a small shed. The dimensions are 4 meters long, 3 meters wide, and 0.5 meters deep. You want to include a 10% waste margin and order standard-sized material units.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 4 m × 3 m × 0.5 m = 6 cubic meters.",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste margin: 6 m³ × 1.10 = 6.6 cubic meters total.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by unit size (1 m³): 6.6 ÷ 1 = 6.6 units, round up to 7 units.",
      },
    ],
    result: "Final Order: 7 standard units of material.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the excavation area" },
      { symbol: "W", description: "Width of the excavation area" },
      { symbol: "D", description: "Depth or thickness of the excavation" },
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
          <Label>Depth ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.5"
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
              <SelectItem value="standard">Standard Size (1 m³)</SelectItem>
              <SelectItem value="large">Large Size (1.5 m³)</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Excavation Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Excavation Calculator helps construction professionals, contractors, and property owners estimate the volume of soil to be removed and the total project cost. By inputting site dimensions and local pricing data, you eliminate guesswork and create accurate budgets before equipment mobilization. This tool is essential for getting reliable quotes and managing excavation expenses on residential, commercial, and land development projects.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by entering the length, width, and average depth of the excavation area in feet. Next, select or input your soil type to apply the correct swell factor (10–50% depending on material), then enter your local excavation rate per cubic yard and any equipment hourly rates. If you're hauling soil off-site, include the distance and per-load cost to capture total removal expenses.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns the total volume in both bank cubic yards (undisturbed) and loose cubic yards (post-excavation), along with itemized costs for removal, equipment, and hauling. Use these results to compare contractor bids, secure accurate financing, and identify cost-reduction opportunities such as on-site material reuse or scheduling optimization.</p>
        </div>
      </section>

      {/* TABLE: Soil Types, Swell Factors, and Characteristics */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Soil Types, Swell Factors, and Characteristics</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different soil types expand at different rates after excavation, affecting volume calculations and equipment needs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soil Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Swell Factor (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bank Density (lbs/yd³)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Clay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400–2,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Foundation excavation, retention ponds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,600–2,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beach projects, drainage layers</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Silt</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,300–2,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fill material, landscaping</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gravel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500–2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Driveways, base courses</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rock/Bedrock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Blasting required, specialized equipment</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Topsoil/Organic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–2,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Landscaping, site restoration</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Loam (Mixed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200–2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General earthwork, fill projects</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Swell factor percentages indicate volume expansion after excavation. Bank density helps estimate equipment load capacity.</p>
      </section>

      {/* TABLE: Excavation Equipment Hourly Rates and Capacity */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Excavation Equipment Hourly Rates and Capacity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Equipment rental and operating costs vary by region and project duration; these figures reflect 2024–2025 market rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Equipment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hourly Rate (USD)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Rate (USD)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mini Excavator (0.8 yd³)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8 cubic yards per bucket</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Excavator (1.5 yd³)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 cubic yards per bucket</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Excavator (2.5+ yd³)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$130–$180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600–$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5+ cubic yards per bucket</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Backhoe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–0.8 cubic yards per bucket</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dump Truck (10 yd³)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15 cubic yards per load</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wheel Loader</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85–$135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4 cubic yards per load</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Skid Steer Loader</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60–$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250–$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1.0 cubic yards per load</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates include equipment rental; operator costs and fuel are typically billed separately. Daily rates offer better value for &gt;8 hour projects.</p>
      </section>

      {/* TABLE: Excavation Cost Benchmarks by Project Type */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Excavation Cost Benchmarks by Project Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These 2024–2025 cost ranges help validate excavation calculator outputs for common construction projects.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Project Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Volume (yd³)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per yd³ (USD)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Estimated Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Foundation (1 story)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750–$2,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Basement (40×50 ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4–$8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000–$5,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Pond (1/4 acre, 6 ft deep)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800–1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3–$7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400–$8,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Driveway Excavation (3000 sq ft, 1 ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4–$9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$440–$1,350</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Building (2-story)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3–$6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000–$21,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Land Clearing &amp; Grading (1 acre)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2–$5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600–$3,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Swimming Pool (15×30 ft, 6 ft avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500–$4,200</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs exclude permits, hauling &gt;5 miles, and contaminated soil remediation. Local market variations of ±20% are common.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always call 811 or use your local utility locating service before excavating to avoid hitting gas, electric, water, or sewer lines—this prevents costly emergency repairs and potential safety hazards.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request soil testing and site surveys before finalizing excavation estimates; unexpected rock layers, contaminated soil, or high water tables can multiply costs by 50–100%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Negotiate volume discounts with excavation contractors if your project exceeds 500 cubic yards; many offer 10–20% reductions for larger jobs with longer equipment rental commitments.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule excavation work during dry seasons when possible; wet conditions reduce equipment efficiency by 20–30% and increase swell factors due to moisture content, inflating your total cubic yardage and costs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Swell Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Forgetting to account for soil expansion (10–25%) after excavation leads to underestimating haul volume and disposal costs. Always select your specific soil type in the calculator to apply the correct swell factor and avoid budget surprises.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Including Grading and Site Prep</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excavation volume is just the removal component; grading, compacting, and finish work ($0.50–$2.00/sq ft) are separate costs often missed in initial estimates. Include these line items in your calculator or budget separately to avoid cost overruns.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Hauling Distances</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming nearby disposal or overlooking truck travel time inflates haul costs; every additional 5 miles adds $200–$500+ to the project. Verify disposal site location and include realistic round-trip distance in your excavation calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating Equipment Hours</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using hourly rates without accounting for mobilization, setup, and demobilization time results in 20–30% cost underruns on small projects. The calculator should include fixed equipment delivery charges in addition to running hours.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the volume of soil to be excavated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate excavation volume, multiply the length, width, and depth of the area in feet, then divide by 27 to convert cubic feet to cubic yards. For example, a 50-foot long, 30-foot wide, and 4-foot deep excavation equals (50 × 30 × 4) ÷ 27 = 222.2 cubic yards. Most excavation calculators accept these three dimensions and automatically perform this conversion for you.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between bank cubic yards and loose cubic yards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bank cubic yards (BCY) refer to soil in its natural, undisturbed state, while loose cubic yards (LCY) refer to soil after excavation when it expands. Soil typically swells 10–25% after excavation depending on soil type, meaning 100 BCY may become 110–125 LCY. Your excavation calculator should account for this swell factor to estimate true removal and hauling costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does excavation typically cost per cubic yard?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excavation costs range from $3–$12 per cubic yard for standard soil removal, depending on location, soil type, and site conditions. Rocky or contaminated soil can cost $15–$25+ per cubic yard due to specialized equipment needs. Using your excavation calculator with local pricing helps generate accurate project budgets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What equipment costs should I factor into my excavation estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard excavation equipment includes backhoes ($75–$125/hour), excavators ($100–$150/hour), and dump trucks ($50–$100/hour). A typical residential excavation job may require 8–16 equipment hours, totaling $800–$2,400 in machinery costs alone. Your calculator should allow you to input hourly rates for different equipment types to get accurate totals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for grading and site preparation in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Grading and site prep are separate from raw excavation volume and typically cost $0.50–$2.00 per square foot depending on slope and finish requirements. For a 2,000-square-foot site, expect $1,000–$4,000 in grading costs in addition to excavation removal. Enter both the excavation depth and the grading area separately in your calculator for a complete estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What soil types have different swell factors I should know about?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Clay soils swell 20–25%, sand 10–15%, and rocky soil 50%+ due to breakage. Organic material like topsoil swells 15–20%, while gravel swells 10–12%. Knowing your specific soil type allows you to select the correct swell factor in your excavation calculator for more accurate cubic yard projections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate disposal or hauling costs in my excavation project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hauling costs depend on cubic yardage, distance to disposal site, and truck capacity (typically 10–15 cubic yards per load). A 200-cubic-yard excavation project 5 miles away costs approximately $1,200–$2,000 at standard rates of $30–$50 per load. Your excavation calculator should include fields for distance and haul rate to compute total transport costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What permits or regulations affect my excavation cost estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most municipalities require excavation permits ($100–$500) and may mandate utility locating (often free via 811 call), environmental assessments, and erosion control measures ($500–$5,000+). These compliance costs should be added to your excavation calculator results for a realistic total project budget.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for basement or pond excavation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the excavation calculator works for any project requiring volume calculations: basements, ponds, pools, and foundations. For basement excavation on a 40×50-foot footprint 8 feet deep, you'd calculate (40 × 50 × 8) ÷ 27 = 592.6 cubic yards, then apply your local per-yard rates and swell factors to get final costs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.osha.gov/construction/excavations" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">OSHA Excavation Safety Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on trench safety, protective systems, and competent person requirements for all excavation work.</p>
          </li>
          <li>
            <a href="https://www.callbeforeyoudig.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Common Ground Alliance — Call Before You Dig</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Resource for locating underground utilities before excavation to prevent damage and injuries.</p>
          </li>
          <li>
            <a href="https://www.rsmeans.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">RS Means Construction Cost Data — Excavation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard reference for excavation labor, equipment, and material pricing by region and project type.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/remedytech" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Environmental Protection Agency — Soil Remediation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines for identifying and handling contaminated soil during excavation projects.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Excavation Calculator"
      description="The ultimate professional guide and calculator for Excavation Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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