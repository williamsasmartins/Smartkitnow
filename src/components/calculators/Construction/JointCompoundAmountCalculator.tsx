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

export default function JointCompoundAmountCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet/inches
    length: "",
    width: "",
    depth: "", // thickness of joint compound layer
    waste: "10", // percent
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert inputs to consistent units (meters for metric, feet for imperial)
   * 2. Calculate volume = length * width * depth (in cubic meters or cubic feet)
   * 3. Convert volume to joint compound quantity in bags:
   *    - Standard bag yield: ~0.011 cubic meters (11 liters) per 18.1 kg bag (40 lbs)
   *    - Large bag yield: ~0.022 cubic meters (22 liters) per 36.3 kg bag (80 lbs)
   * 4. Add waste percentage
   * 5. Calculate cost if price per bag is provided
   */

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const isMetric = inputs.unit === "metric";

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all dimensions to meters if metric, or feet if imperial
    // For metric: inputs are in meters (m)
    // For imperial: inputs are in feet (ft)
    // Depth is thickness of joint compound layer (e.g. 0.005 m = 5 mm or 1/16 inch)

    // Calculate volume in cubic meters or cubic feet
    const volume = lengthNum * widthNum * depthNum;

    // Bag yields:
    // Standard bag (18.1 kg / 40 lbs) covers approx 11 liters = 0.011 m³
    // Large bag (36.3 kg / 80 lbs) covers approx 22 liters = 0.022 m³
    // For imperial, convert yields to cubic feet:
    // 1 cubic meter = 35.3147 cubic feet
    // So standard bag yield in cubic feet = 0.011 * 35.3147 ≈ 0.3885 ft³
    // Large bag yield in cubic feet = 0.022 * 35.3147 ≈ 0.777 ft³

    let bagYield = 0.011; // default standard bag yield in m³
    if (inputs.materialSize === "large") {
      bagYield = 0.022;
    }
    if (!isMetric) {
      bagYield *= 35.3147; // convert to cubic feet
    }

    // Calculate raw bags needed
    const rawBags = volume / bagYield;

    // Add waste margin
    const totalBags = rawBags * (1 + wastePercent / 100);

    // Round up to nearest whole bag
    const bagsRounded = Math.ceil(totalBags);

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? (bagsRounded * priceNum).toFixed(2) : null;

    return {
      mainQty: `${bagsRounded} Bag${bagsRounded > 1 ? "s" : ""}`,
      cost: cost ? `$${cost}` : "Price not set",
      details: `Raw quantity: ${rawBags.toFixed(2)} bags`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is joint compound and why do I need to calculate the amount needed?",
      answer: "Joint compound, also called drywall mud or spackle, is a gypsum-based product used to fill seams and imperfections in drywall installations. Calculating the correct amount prevents material waste and project delays, as running short mid-project is costly and time-consuming. A typical 12 ft × 10 ft room with standard drywall requires 8–12 gallons of compound for taping and finishing.",
    },
    {
      question: "How many square feet of drywall can one gallon of joint compound cover?",
      answer: "One gallon of joint compound typically covers 300–400 square feet for a single coat application, depending on wall texture and application method. For three-coat finishing (which is standard), coverage drops to approximately 100–130 square feet per gallon. Using this ratio, a 1,000 sq ft room requires roughly 8–10 gallons for complete finishing.",
    },
    {
      question: "What's the difference between all-purpose and lightweight joint compound?",
      answer: "All-purpose compound weighs approximately 1.6 lbs per gallon and works for taping, finishing, and repairs across all drywall applications. Lightweight compound weighs around 0.9–1.1 lbs per gallon, sands easier, and covers slightly more area per gallon (350–450 sq ft), making it ideal for finish coats. All-purpose is generally more economical for large projects, while lightweight is preferred for final aesthetic coats.",
    },
    {
      question: "How much does joint compound weigh, and how many bags or buckets do I need to buy?",
      answer: "A standard 5-gallon bucket of all-purpose compound weighs 40–45 lbs, while a 25-lb bag contains approximately 2.8–3 gallons. For a 2,000 sq ft project requiring 15–20 gallons, you'd need 3–4 five-gallon buckets or 5–7 bags. Always add 10–15% extra for waste and application variability.",
    },
    {
      question: "What's the cost difference between pre-mixed and dry joint compound?",
      answer: "Pre-mixed joint compound costs $8–$15 per 5-gallon bucket (approximately $1.60–$3.00 per gallon), while dry powder costs $6–$12 per 25-lb bag (approximately $0.24–$0.48 per gallon when mixed). For projects exceeding 500 sq ft, dry compound is significantly more economical, though it requires water mixing and has a shorter working time once activated.",
    },
    {
      question: "How do I account for drywall seams versus repair patches in my calculation?",
      answer: "Drywall seams typically require 3 coats (taping, finishing, sanding), using approximately 0.3–0.5 gallons per 100 linear feet of seam. Repair patches use more compound per square foot, averaging 2–3 gallons per 100 sq ft of patched area. A calculator should separate these inputs: linear feet of seams at standard coverage versus individual patch square footage at higher consumption rates.",
    },
    {
      question: "What application method affects joint compound consumption rates?",
      answer: "Knife application (manual spreading) uses 60–80 sq ft per gallon per coat, while spray application covers 400–600 sq ft per gallon with thinner coats. Texture application (popcorn finish) consumes 150–200 sq ft per gallon. Your method choice directly impacts total gallons needed; spray methods reduce material by 20–40% compared to knife application.",
    },
    {
      question: "Should I factor in shrinkage when calculating joint compound amounts?",
      answer: "Yes—joint compound shrinks 10–15% as it dries, particularly in the first 24 hours. This means a 1-inch thick application may shrink to 0.85–0.9 inches, requiring additional coats or thicker initial applications. For precision projects, add 12% to your base calculation to account for shrinkage and ensure adequate thickness for sanding and finishing.",
    },
    {
      question: "How many coats of joint compound are standard for professional-quality drywall finishing?",
      answer: "Standard drywall finishing requires 3 coats: a taping coat (embedding tape), a finishing coat, and a final smooth coat. Each coat uses progressively wider knives (6-inch, 10-inch, and 12-inch respectively) and consumes approximately one-third of total compound. Heavy-use commercial spaces may require 4 coats, while simple repairs need only 2 coats.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are finishing drywall in a room where you need to apply joint compound over taped seams. The area to cover measures 5 meters in length, 3 meters in width, and you plan a total compound thickness of 0.005 meters (5 mm). You want to include a 10% waste margin and use standard size bags priced at $15 each.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 5 m × 3 m × 0.005 m = 0.075 cubic meters of joint compound needed.",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste: 0.075 × 1.10 = 0.0825 cubic meters total volume.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by bag yield (0.011 m³ per standard bag): 0.0825 ÷ 0.011 ≈ 7.5 bags. Round up to 8 bags.",
      },
    ],
    result: "Final Order: 8 Standard Bags, Estimated Cost: $120.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the area (meters or feet)" },
      { symbol: "W", description: "Width of the area (meters or feet)" },
      { symbol: "D", description: "Depth or thickness of joint compound layer (meters or feet)" },
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
            placeholder={inputs.unit === "metric" ? "e.g. 0.005 (5 mm)" : "e.g. 0.016 (1/16 ft)"}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (18.1 kg / 40 lbs)</SelectItem>
              <SelectItem value="large">Large Size (36.3 kg / 80 lbs)</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Joint Compound Amount Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Joint Compound Amount Calculator is a construction planning tool that determines the exact quantity of drywall mud needed for your project, helping you avoid material shortages and minimize waste. Whether you're finishing new drywall, patching damaged areas, or applying texture, accurate calculations prevent costly mid-project material runs and budget overruns. This calculator accounts for multiple application methods, compound types, and project complexity to deliver precise estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by inputting your project dimensions: total square footage of wall area, linear feet of seams (tape lines where drywall sheets meet), and the number of repair patches if applicable. Next, select your application method (knife, spray, or texture), choose your compound type (all-purpose, lightweight, or quick-set), and specify the number of coats planned. The calculator uses industry-standard coverage rates (75–600 sq ft per gallon depending on method) and automatically applies a 12% shrinkage factor to ensure adequate material for final finishing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The output provides total gallons required, equivalent bags or buckets needed for purchase, and estimated material cost based on current pricing. Results are displayed in multiple formats (gallons, 5-gallon buckets, and 25-lb bags) so you can order in the most convenient unit. Use the waste factor recommendation (typically 10–15%) to round up your order, and cross-reference the coverage table to verify results match your specific application technique.</p>
        </div>
      </section>

      {/* TABLE: Joint Compound Coverage Rates by Application Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Joint Compound Coverage Rates by Application Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical coverage rates per gallon based on application method and number of coats.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Application Method</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage per Gallon (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use Case</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per 100 sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Knife Application (Single Coat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drywall seams and repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8–$12</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Knife Application (3-Coat System)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard interior finishing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24–$45</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spray Application (Single Coat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large commercial projects</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2–$4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texture/Popcorn Finish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ceiling and acoustic finishes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightweight Compound (Finish Coat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Final aesthetic coat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$8</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage rates assume standard application technique and environmental conditions (50–85°F, 30–60% humidity). Actual coverage varies with wall texture, applicator skill, and compound viscosity.</p>
      </section>

      {/* TABLE: Joint Compound Product Types and Specifications */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Joint Compound Product Types and Specifications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Comparison of common joint compound formulations with weight, coverage, and pricing data.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs per gallon)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage (sq ft/gallon)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drying Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Cost (5-gallon bucket)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">All-Purpose (Pre-mixed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10–$15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightweight (Pre-mixed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–18 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12–$18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quick-Set (20-minute)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280–350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14–$20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Setting-Type (45-minute)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280–350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12–$16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry Powder (25-lb bag)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8–3 gallons mixed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices reflect 2024–2025 retail averages. Professional-grade products from brands like USG, DAP, and Sheetrock® may vary by region and distributor. Quick-set and setting-type compounds are premixed powders requiring water activation.</p>
      </section>

      {/* TABLE: Estimated Material Requirements by Room Size */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Material Requirements by Room Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for total joint compound gallons needed based on room dimensions and standard 3-coat finishing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Linear Feet of Seams (typical)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gallons Required (3-coat)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Cost (all-purpose)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200 (12×17)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20–$45</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400 (20×20)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240–280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40–$75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">800 (20×40)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480–560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80–$150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200 (30×40)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">720–840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120–$225</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000+ (large commercial)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$180–$375</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates assume standard 8-foot ceilings, 4 walls, rectangular layout, and all-purpose compound at $10–$15 per 5-gallon bucket. Figures exclude waste factor (add 10–15%) and account for approximately 200–250 linear feet of seams per 1,000 sq ft.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add 10–15% to your calculated amount for waste, shrinkage variability, and application errors—running short on a drywall project is far more costly than having leftover compound.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For projects &gt;1,000 sq ft, purchase dry powder compound instead of pre-mixed; it costs 60–75% less per gallon once mixed and maintains longer shelf life in storage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate seams and patches separately in your planning: seams use roughly 0.3–0.5 gallons per 100 linear feet, while patches consume 2–3 gallons per 100 sq ft of repair area.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule compound purchases 2–3 days before application; pre-mixed compound has a 6–12 month shelf life, while dry powder remains stable for 2+ years if kept dry and sealed.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Seam Length</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIYers forget to count vertical seams, ceiling seams, and corner joints, calculating only horizontal seams between sheets. A typical 12×12 ft room contains 140–180 linear feet of seams, not just 60–80 ft from the walls. Always measure wall-to-wall, floor-to-ceiling, and corner-to-corner runs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Shrinkage and Multiple Coats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating compound as if a single thick coat will suffice misses the 3-coat standard for professional finishes. Each coat shrinks 10–15%, requiring additional applications; using your base amount for only one coat leaves unfinished results and wasted time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Product Types in One Project</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Switching between all-purpose and lightweight compound mid-project creates finish inconsistencies and adhesion issues. Calculate your total need upfront and stick with one product type; if budget forces a choice, use all-purpose for taping and lightweight only for final finish coats.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Environmental Conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Drying times and coverage rates change dramatically in cold (&lt;50°F), humid (&gt;60%), or hot (&gt;85°F) conditions. Rushing application in unfavorable weather leads to cracking, longer cure times, and the need for additional coats, increasing total material consumption by 20–30%.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is joint compound and why do I need to calculate the amount needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Joint compound, also called drywall mud or spackle, is a gypsum-based product used to fill seams and imperfections in drywall installations. Calculating the correct amount prevents material waste and project delays, as running short mid-project is costly and time-consuming. A typical 12 ft × 10 ft room with standard drywall requires 8–12 gallons of compound for taping and finishing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many square feet of drywall can one gallon of joint compound cover?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One gallon of joint compound typically covers 300–400 square feet for a single coat application, depending on wall texture and application method. For three-coat finishing (which is standard), coverage drops to approximately 100–130 square feet per gallon. Using this ratio, a 1,000 sq ft room requires roughly 8–10 gallons for complete finishing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between all-purpose and lightweight joint compound?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All-purpose compound weighs approximately 1.6 lbs per gallon and works for taping, finishing, and repairs across all drywall applications. Lightweight compound weighs around 0.9–1.1 lbs per gallon, sands easier, and covers slightly more area per gallon (350–450 sq ft), making it ideal for finish coats. All-purpose is generally more economical for large projects, while lightweight is preferred for final aesthetic coats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does joint compound weigh, and how many bags or buckets do I need to buy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard 5-gallon bucket of all-purpose compound weighs 40–45 lbs, while a 25-lb bag contains approximately 2.8–3 gallons. For a 2,000 sq ft project requiring 15–20 gallons, you'd need 3–4 five-gallon buckets or 5–7 bags. Always add 10–15% extra for waste and application variability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the cost difference between pre-mixed and dry joint compound?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-mixed joint compound costs $8–$15 per 5-gallon bucket (approximately $1.60–$3.00 per gallon), while dry powder costs $6–$12 per 25-lb bag (approximately $0.24–$0.48 per gallon when mixed). For projects exceeding 500 sq ft, dry compound is significantly more economical, though it requires water mixing and has a shorter working time once activated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for drywall seams versus repair patches in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Drywall seams typically require 3 coats (taping, finishing, sanding), using approximately 0.3–0.5 gallons per 100 linear feet of seam. Repair patches use more compound per square foot, averaging 2–3 gallons per 100 sq ft of patched area. A calculator should separate these inputs: linear feet of seams at standard coverage versus individual patch square footage at higher consumption rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What application method affects joint compound consumption rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Knife application (manual spreading) uses 60–80 sq ft per gallon per coat, while spray application covers 400–600 sq ft per gallon with thinner coats. Texture application (popcorn finish) consumes 150–200 sq ft per gallon. Your method choice directly impacts total gallons needed; spray methods reduce material by 20–40% compared to knife application.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I factor in shrinkage when calculating joint compound amounts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—joint compound shrinks 10–15% as it dries, particularly in the first 24 hours. This means a 1-inch thick application may shrink to 0.85–0.9 inches, requiring additional coats or thicker initial applications. For precision projects, add 12% to your base calculation to account for shrinkage and ensure adequate thickness for sanding and finishing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many coats of joint compound are standard for professional-quality drywall finishing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard drywall finishing requires 3 coats: a taping coat (embedding tape), a finishing coat, and a final smooth coat. Each coat uses progressively wider knives (6-inch, 10-inch, and 12-inch respectively) and consumes approximately one-third of total compound. Heavy-use commercial spaces may require 4 coats, while simple repairs need only 2 coats.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/Product_Sales_Pages/Drywall_Products/USG_Drywall_Installation_Guide.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USG Drywall and Joint Compound Installation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official technical specifications and coverage rates from USG, the leading drywall and joint compound manufacturer in North America.</p>
          </li>
          <li>
            <a href="https://www.astm.org/Standards/C475" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM C475 Standard Specification for Joint Compounds for Drywall Construction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard defining joint compound composition, performance requirements, and testing methodologies across all product types.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/estimate-joint-compound-2744805" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce: How to Estimate Drywall Joint Compound</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer-friendly guide with calculation examples and application best practices for residential drywall finishing projects.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/construction-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NAHB-recommended guidelines for drywall finishing techniques, material quantities, and quality standards for professional construction.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Joint Compound Amount Calculator"
      description="The ultimate professional guide and calculator for Joint Compound Amount Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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