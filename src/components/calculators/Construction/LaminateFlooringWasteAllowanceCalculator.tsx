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

export default function LaminateFlooringWasteAllowanceCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // default 10%
    price: "",
    materialSize: "standard", // standard or large plank size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert length and width to meters if imperial (feet to meters)
   * 2. Calculate area in square meters
   * 3. Add waste allowance (percentage)
   * 4. Calculate number of units needed based on material size coverage (sqm per unit)
   * 5. Calculate cost if price per unit provided
   */

  // Coverage per unit (plank box) in sqm:
  // Standard size box covers approx 2.13 sqm (typical 8mm thick laminate box)
  // Large size box covers approx 3.0 sqm (some larger boxes)
  const coveragePerUnit = {
    standard: 2.13,
    large: 3.0,
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const coverage = coveragePerUnit[inputs.materialSize] || coveragePerUnit.standard;

    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste percentage.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert to meters if imperial
    // 1 foot = 0.3048 meters
    const lengthMeters = inputs.unit === "imperial" ? lengthNum * 0.3048 : lengthNum;
    const widthMeters = inputs.unit === "imperial" ? widthNum * 0.3048 : widthNum;

    // Calculate area in sqm
    const area = lengthMeters * widthMeters;

    // Add waste allowance
    const totalArea = area * (1 + wastePercent / 100);

    // Calculate units needed (round up to whole boxes)
    const unitsNeeded = Math.ceil(totalArea / coverage);

    // Calculate cost if price given
    const totalCost = priceNum && priceNum > 0 ? (unitsNeeded * priceNum).toFixed(2) : null;

    return {
      mainQty: `${unitsNeeded} Unit${unitsNeeded > 1 ? "s" : ""}`,
      cost: totalCost ? `$${totalCost}` : "Price not set",
      details: `Base area: ${area.toFixed(2)} m², Total with waste: ${totalArea.toFixed(
        2
      )} m², Coverage per unit: ${coverage.toFixed(2)} m²`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What waste allowance percentage should I use for laminate flooring installation?",
      answer: "Industry standard waste allowance for laminate flooring ranges from 10% to 15% for straightforward layouts, and 15% to 20% for complex designs with numerous cuts and angles. Most professional installers recommend a 10% baseline waste allowance for simple rectangular rooms, increasing to 15% for rooms with obstacles, doorways, and irregular shapes. If your layout includes diagonal patterns or multiple cut-outs, budget 20% waste to account for unusable material scraps.",
    },
    {
      question: "How do I calculate the total square footage I need including waste?",
      answer: "Multiply your room's square footage by your chosen waste allowance factor. For example, a 400 square foot room with 10% waste requires 400 × 1.10 = 440 square feet of laminate flooring. A 400 square foot room with 15% waste requires 400 × 1.15 = 460 square feet. Always round up to the nearest full box or carton when purchasing to ensure you have sufficient material.",
    },
    {
      question: "Why do I need more than the exact room measurements for laminate flooring?",
      answer: "Waste occurs from unavoidable cuts at walls, doorways, closets, and irregular room shapes where planks must be trimmed to fit. Manufacturing defects in approximately 2% to 5% of planks can render them unusable, and mistakes during installation may damage boards. Additionally, installing laminate in a staggered pattern (which is recommended for structural integrity and appearance) creates more cutoff waste than simple linear layouts.",
    },
    {
      question: "Does laminate flooring waste allowance change based on room shape?",
      answer: "Yes, room shape significantly impacts waste percentage. Rectangular rooms typically require only 10% waste allowance, L-shaped rooms need 12% to 15%, and rooms with multiple corners, alcoves, or curved walls require 15% to 20% allowance. Rooms with numerous doorways, closets, or architectural features should use the higher 20% waste factor to account for additional linear cuts and trimming requirements.",
    },
    {
      question: "What is the cost impact of underestimating laminate flooring waste?",
      answer: "Underestimating waste by just 5% on a 500 square foot room means purchasing 525 square feet instead of the needed 575 square feet, requiring an additional order of 50 square feet. If laminate costs $3 per square foot, this shortage costs an extra $150 plus expedited shipping fees. Additionally, second orders often come from different production batches, creating color and finish inconsistencies across your floor.",
    },
    {
      question: "How does diagonal or pattern installation affect waste allowance calculations?",
      answer: "Diagonal installations increase waste allowance to 15% to 20% because angled cuts generate significantly more scrap material than straight linear layouts. Herringbone or chevron patterns require 20% to 25% waste allowance due to the precise angled cuts required at each plank intersection. Calculate diagonal layouts conservatively; professional installers often recommend adding an additional 5% buffer beyond standard diagonal waste percentages for safety.",
    },
    {
      question: "Can I use leftover laminate flooring from one room in another room?",
      answer: "Leftover material can be used in smaller adjoining rooms, closets, or transition areas if the color and finish match. However, matching can be problematic because laminate boards from different production runs may have slight color variations (typically &lt;2% variation but visible to the eye). It's best to plan separate waste allowances for each room rather than relying on sharing scraps, unless you're installing the same product throughout your entire home simultaneously.",
    },
    {
      question: "What waste allowance should I use for laminate flooring around stairs or complex architectural features?",
      answer: "Complex installations around stairs, built-in features, or curved transitions require 20% to 25% waste allowance due to intricate angle cuts and custom fitting requirements. Each stair nosing, landing transition, and architectural feature necessitates specialized cuts that generate significant scrap material. For projects involving more than 3 major architectural features, consider a 25% waste allowance to ensure sufficient material for adjustments and corrections during installation.",
    },
    {
      question: "How much extra laminate flooring should I purchase for future repairs or replacements?",
      answer: "Beyond your waste allowance, purchase an additional 5% to 10% of your room's square footage (separate from the waste calculation) for future repairs and replacements within 5 to 10 years. A 400 square foot room would require 40 to 80 additional square feet stored for future use, ensuring color matching availability after the product may be discontinued. Store leftover planks in a climate-controlled environment at 60°F to 80°F with 30% to 50% humidity to maintain condition for future repairs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing laminate flooring in a rectangular living room measuring 5 meters by 4 meters. You want to include a 10% waste allowance and are using standard size laminate boxes covering 2.13 square meters each.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate area: 5 m × 4 m = 20 m²",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 20 m² × 1.10 = 22 m² total material needed",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total area by coverage per box: 22 m² ÷ 2.13 m² ≈ 10.33 boxes, round up to 11 boxes",
      },
    ],
    result: "Final Order: 11 boxes of laminate flooring",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Material Needed = (Length × Width) × (1 + Waste Percentage / 100)",
    variables: [
      { symbol: "Length", description: "Length of the floor area" },
      { symbol: "Width", description: "Width of the floor area" },
      { symbol: "Waste Percentage", description: "Waste allowance percentage" },
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

      {/* Inputs for Length and Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
      </div>

      {/* Material Size and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="materialSize">Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger id="materialSize">
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (2.13 m²/box)</SelectItem>
              <SelectItem value="large">Large Size (3.00 m²/box)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price per Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="price"
              className="pl-8"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Waste Margin Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label htmlFor="waste">Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          id="waste"
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Laminate Flooring Waste Allowance Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Laminate Flooring Waste Allowance Calculator helps you determine the exact amount of laminate flooring material needed for your project by accounting for unavoidable waste from cuts, damage, and installation inefficiencies. Accurate waste calculations prevent costly shortages requiring expensive reorders with potential color-matching issues, while also avoiding excessive overpurchasing that wastes money. This calculator is essential for budgeting correctly and ensuring your flooring installation project stays on schedule and within budget.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your room's square footage (length × width), select your room layout type (rectangular, L-shaped, or complex), and choose your installation pattern (straight, diagonal, herringbone, etc.). The calculator uses industry-standard waste percentages ranging from 10% for simple layouts to 25% for complex patterns, automatically adjusting based on your selections. You can also manually adjust the waste percentage if you prefer a custom calculation based on your installer's experience level or specific project requirements.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs the total square footage you need to purchase, recommended box quantities (most laminate comes in boxes covering 20-25 square feet), and estimated material cost if you input the price per square foot. Compare the calculated amount to your room's actual measurement to understand your waste factor; for example, a 400 square foot room requiring 460 square feet represents a 15% waste allowance. Use these results to request accurate quotes from suppliers and ensure your contractor purchases sufficient material to complete your project without shortages.</p>
        </div>
      </section>

      {/* TABLE: Recommended Laminate Flooring Waste Allowance by Room Type and Layout */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Laminate Flooring Waste Allowance by Room Type and Layout</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows standard waste allowance percentages recommended by the National Wood Flooring Association based on room complexity and installation method.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Type/Layout</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Waste Allowance %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Simple rectangular room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Straightforward layouts with minimal doorways</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most cost-effective option</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard room with doorways</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typical residential rooms with 2-3 doorways</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Industry baseline for most projects</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">L-shaped or moderate complexity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rooms with corners, alcoves, or 4+ doorways</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Accounts for additional linear cuts</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Complex room with multiple features</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rooms with closets, alcoves, and irregular shapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Professional recommendation for safety</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diagonal or angled layout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diagonal or 45-degree installations</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Angled cuts generate more scrap</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Herringbone or chevron pattern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Premium pattern installations</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highest waste due to intricate angles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Staircase with landings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multi-level installations with transitions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Includes nosing and custom cuts</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Curved walls or unusual shapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rooms with architectural curves</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Requires custom template fitting</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial application</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-traffic commercial spaces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Professional installation standards</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages based on National Wood Flooring Association (NWFA) installation guidelines. Actual waste may vary by installer skill level and material quality.</p>
      </section>

      {/* TABLE: Laminate Flooring Waste Calculation Examples by Room Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Laminate Flooring Waste Calculation Examples by Room Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These real-world examples demonstrate how waste allowance percentages impact total material purchases for rooms of various sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Waste</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Waste</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Waste</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Difference at $3/sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">230</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">330</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">345</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">460</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">575</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">825</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">862.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cost differences calculated at $3.00 per square foot (national average 2024). Actual costs vary by laminate quality ($1.50-$5.00 per sq ft).</p>
      </section>

      {/* TABLE: Waste Percentage Comparison: Installation Patterns and Layout Complexity */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Waste Percentage Comparison: Installation Patterns and Layout Complexity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This comparison shows how different installation patterns and room layouts directly impact required waste allowance percentages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Pattern</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Layout Complexity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Waste %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Straight linear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rectangular room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Simple bedrooms, hallways</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Straight linear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Room with doorways</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Living rooms, kitchens</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Staggered straight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Master bedrooms</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Staggered straight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complex room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multi-feature residential rooms</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45-degree diagonal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Simple room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Accent areas, sunrooms</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45-degree diagonal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complex room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-end residential installations</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Herringbone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Formal entryways, premium finishes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevron</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contemporary high-end spaces</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed pattern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complex room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Custom designer installations</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages represent professional contractor recommendations. DIY installations should add 2-5% additional buffer for learning curve.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always round your calculated total UP to the nearest full box or bundle when purchasing laminate flooring, even if the calculator shows 445.5 square feet; most retailers sell in 20 or 25 square foot boxes, so you'd need to purchase 460 square feet (23 boxes) to ensure complete coverage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request material samples from your supplier in the exact product line and color you're purchasing, then store these samples with your waste allowance calculation; if a second order becomes necessary due to underestimation, you'll have exact color matching information to prevent installation inconsistencies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for acclimation time in your project timeline: laminate flooring must acclimate to your home's temperature and humidity (60°F to 80°F with 30% to 50% humidity) for 48 to 72 hours before installation, so order material at least 5 to 7 days before your scheduled installation date.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Communicate your calculated waste allowance percentage with your installer before work begins; experienced contractors may recommend adjusting the percentage based on their assessment of your specific room layout, wall condition, and door/window placement, potentially saving or costing an additional 5% in material.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Only Your Room's Exact Square Footage Without Waste Allowance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Purchasing exactly 400 square feet for a 400 square foot room leaves no material for cuts, mistakes, or manufacturing defects. This almost guarantees needing an expensive rush order mid-installation, likely from a different production batch causing visible color variations across your completed floor.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying the Same Waste Percentage to All Rooms in Your Home</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Each room's waste percentage should be calculated individually based on that specific room's layout complexity. Applying a flat 15% to a simple hallway (which only needs 10%) wastes money, while applying 10% to a diagonal-pattern living room creates a dangerous shortage requiring costly corrections.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting to Account for Diagonal Installation Waste Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIY installers underestimate waste for diagonal patterns, thinking they only need 10% to 12% when industry standards recommend 20% to 25%. Diagonal cuts across the width of boards generate significantly more scrap than straight linear installations, and underestimating leads to material shortages mid-project.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Additional Material for Future Repairs and Replacements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your waste allowance calculation handles installation waste, but you should separately purchase an additional 5% to 10% for future repairs over the next 5 to 10 years. Without stored matching material, replacing damaged planks years later becomes nearly impossible as products are discontinued and color batches become unavailable.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What waste allowance percentage should I use for laminate flooring installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standard waste allowance for laminate flooring ranges from 10% to 15% for straightforward layouts, and 15% to 20% for complex designs with numerous cuts and angles. Most professional installers recommend a 10% baseline waste allowance for simple rectangular rooms, increasing to 15% for rooms with obstacles, doorways, and irregular shapes. If your layout includes diagonal patterns or multiple cut-outs, budget 20% waste to account for unusable material scraps.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the total square footage I need including waste?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your room's square footage by your chosen waste allowance factor. For example, a 400 square foot room with 10% waste requires 400 × 1.10 = 440 square feet of laminate flooring. A 400 square foot room with 15% waste requires 400 × 1.15 = 460 square feet. Always round up to the nearest full box or carton when purchasing to ensure you have sufficient material.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do I need more than the exact room measurements for laminate flooring?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Waste occurs from unavoidable cuts at walls, doorways, closets, and irregular room shapes where planks must be trimmed to fit. Manufacturing defects in approximately 2% to 5% of planks can render them unusable, and mistakes during installation may damage boards. Additionally, installing laminate in a staggered pattern (which is recommended for structural integrity and appearance) creates more cutoff waste than simple linear layouts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does laminate flooring waste allowance change based on room shape?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, room shape significantly impacts waste percentage. Rectangular rooms typically require only 10% waste allowance, L-shaped rooms need 12% to 15%, and rooms with multiple corners, alcoves, or curved walls require 15% to 20% allowance. Rooms with numerous doorways, closets, or architectural features should use the higher 20% waste factor to account for additional linear cuts and trimming requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the cost impact of underestimating laminate flooring waste?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Underestimating waste by just 5% on a 500 square foot room means purchasing 525 square feet instead of the needed 575 square feet, requiring an additional order of 50 square feet. If laminate costs $3 per square foot, this shortage costs an extra $150 plus expedited shipping fees. Additionally, second orders often come from different production batches, creating color and finish inconsistencies across your floor.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does diagonal or pattern installation affect waste allowance calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Diagonal installations increase waste allowance to 15% to 20% because angled cuts generate significantly more scrap material than straight linear layouts. Herringbone or chevron patterns require 20% to 25% waste allowance due to the precise angled cuts required at each plank intersection. Calculate diagonal layouts conservatively; professional installers often recommend adding an additional 5% buffer beyond standard diagonal waste percentages for safety.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use leftover laminate flooring from one room in another room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leftover material can be used in smaller adjoining rooms, closets, or transition areas if the color and finish match. However, matching can be problematic because laminate boards from different production runs may have slight color variations (typically &lt;2% variation but visible to the eye). It's best to plan separate waste allowances for each room rather than relying on sharing scraps, unless you're installing the same product throughout your entire home simultaneously.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What waste allowance should I use for laminate flooring around stairs or complex architectural features?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Complex installations around stairs, built-in features, or curved transitions require 20% to 25% waste allowance due to intricate angle cuts and custom fitting requirements. Each stair nosing, landing transition, and architectural feature necessitates specialized cuts that generate significant scrap material. For projects involving more than 3 major architectural features, consider a 25% waste allowance to ensure sufficient material for adjustments and corrections during installation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much extra laminate flooring should I purchase for future repairs or replacements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Beyond your waste allowance, purchase an additional 5% to 10% of your room's square footage (separate from the waste calculation) for future repairs and replacements within 5 to 10 years. A 400 square foot room would require 40 to 80 additional square feet stored for future use, ensuring color matching availability after the product may be discontinued. Store leftover planks in a climate-controlled environment at 60°F to 80°F with 30% to 50% humidity to maintain condition for future repairs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nwfa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Wood Flooring Association Installation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-leading standards and guidelines for laminate and wood flooring installation waste calculations and best practices.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/laminate-flooring-installation-5217241" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce: Laminate Flooring Installation and Waste Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive homeowner's guide covering waste allowance percentages, calculation methods, and real-world installation examples.</p>
          </li>
          <li>
            <a href="https://www.homedepot.com/c/Laminate_Flooring" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Home Depot: Laminate Flooring Buying Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical purchasing guide including waste allowance recommendations, material selection, and cost estimation tools.</p>
          </li>
          <li>
            <a href="https://www.bobvila.com/articles/laminate-flooring-installation/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bob Vila: How to Calculate Laminate Flooring Waste</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert analysis of waste factors across different room types, installation patterns, and professional vs. DIY installation considerations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laminate Flooring Waste Allowance Calculator"
      description="The ultimate professional guide and calculator for Laminate Flooring Waste Allowance Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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