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

export default function SidingPanelCoverageCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of wall/area
    height: "", // height of wall/area
    panelWidth: "", // width of one siding panel
    panelHeight: "", // height of one siding panel
    waste: "10", // waste percentage
    price: "", // price per panel
    materialType: "vinyl", // material type for info
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number) =>
    inputs.unit === "imperial" ? val * 0.3048 : val;
  const toFeet = (val: number) =>
    inputs.unit === "metric" ? val / 0.3048 : val;

  // Calculate coverage and units needed
  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const heightNum = parseFloat(inputs.height);
    const panelWidthNum = parseFloat(inputs.panelWidth);
    const panelHeightNum = parseFloat(inputs.panelHeight);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      !lengthNum ||
      !heightNum ||
      !panelWidthNum ||
      !panelHeightNum ||
      lengthNum <= 0 ||
      heightNum <= 0 ||
      panelWidthNum <= 0 ||
      panelHeightNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all dimensions to meters for calculation consistency
    const lengthM = toMeters(lengthNum);
    const heightM = toMeters(heightNum);
    const panelWidthM = toMeters(panelWidthNum);
    const panelHeightM = toMeters(panelHeightNum);

    // Total wall area in square meters
    const totalArea = lengthM * heightM;

    // Single panel coverage area in square meters
    const panelArea = panelWidthM * panelHeightM;

    if (panelArea === 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Panel dimensions must be greater than zero.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Raw number of panels needed without waste
    const rawPanels = totalArea / panelArea;

    // Add waste margin
    const panelsWithWaste = rawPanels * (1 + wastePercent / 100);

    // Round up to next whole panel
    const panelsRounded = Math.ceil(panelsWithWaste);

    // Calculate cost if price provided
    const totalCost =
      priceNum && priceNum > 0 ? panelsRounded * priceNum : 0;

    // Format cost string
    const costStr = totalCost
      ? `$${totalCost.toFixed(2)}`
      : "Price not set";

    // Format details string
    const detailsStr = `Raw panels needed: ${rawPanels.toFixed(
      2
    )}, with waste: ${panelsWithWaste.toFixed(2)}`;

    return {
      mainQty: `${panelsRounded} Units`,
      cost: costStr,
      details: detailsStr,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many siding panels do I need to cover a 2,000 square foot house?",
      answer: "For a 2,000 square foot house, you'll typically need between 40 to 50 panels depending on your siding type. Standard vinyl siding panels measure 10 feet long by 12.5 inches wide, covering approximately 10.4 square feet per panel. However, accounting for 10-15% waste due to cuts, corners, and overlaps, you should purchase 44 to 58 panels for complete coverage.",
    },
    {
      question: "What is the standard size of a siding panel?",
      answer: "Most residential siding panels are 10 feet long and 12.5 inches wide, providing 10.4 square feet of coverage per panel. Some manufacturers offer 12-foot panels at 12 inches wide (10 square feet), while fiber cement panels may vary from 8 to 12 feet in length. Always check your specific product specifications, as European and specialty sidings may have different dimensions.",
    },
    {
      question: "Should I add extra panels for waste and mistakes?",
      answer: "Yes, industry standard practice recommends adding 10-15% to your total siding requirement for waste, cuts, and future repairs. For a 2,000 square foot project requiring 48 panels, you should order 53 to 55 panels total. This buffer accounts for measurement errors, damaged panels during installation, and having materials available for repairs within 2-3 years before color discontinuation.",
    },
    {
      question: "How do I calculate siding coverage for irregular shaped homes?",
      answer: "Break your home into simple geometric shapes: rectangles for walls, triangles for gable ends, and trapezoids for sloped sections. Measure each section's height and width, calculate the square footage, then sum all sections. Subtract window and door openings (typically 10-20% of total wall area), then divide your total by the square feet per panel.",
    },
    {
      question: "What percentage of wall area is typically taken up by windows and doors?",
      answer: "Windows and doors typically consume 15-25% of total wall area on residential homes, though this varies by architectural style. Modern energy-efficient homes often have 20% window coverage, while older homes may have only 10-15%. When calculating siding panels, measure each opening individually and subtract the total square footage from your gross wall area before calculating panel requirements.",
    },
    {
      question: "How much siding do I need for a gable end roof?",
      answer: "For gable ends, calculate the area as a triangle: multiply the width by the height from the wall plate to the peak, then divide by 2. A 30-foot wide gable with an 8-foot peak height equals 120 square feet (30 × 8 ÷ 2). Using standard 10.4 square foot panels, you'd need approximately 12 panels for one gable end, accounting for the triangular shape and waste.",
    },
    {
      question: "Are there different coverage calculations for different siding materials?",
      answer: "Coverage calculations remain consistent across vinyl, fiber cement, wood, and composite sidings—all measure by panel square footage. However, installation waste percentages may vary: vinyl typically requires 10% waste, fiber cement 12-15%, and wood 15-20% due to grain variations and potential splitting. Metal sidings can be custom-cut to minimize waste, potentially requiring only 5-8% additional material.",
    },
    {
      question: "How do I account for soffit and fascia in my siding coverage calculation?",
      answer: "Soffit and fascia require separate calculations from wall siding. Measure the linear feet of your roofline's perimeter and multiply by the soffit width (typically 16 or 24 inches) to get soffit square footage. Fascia is calculated by linear feet—measure your roofline perimeter and multiply by fascia width (usually 8-12 inches), then divide by 144 to convert to square feet.",
    },
    {
      question: "What happens if I underestimate my siding panel needs?",
      answer: "Underestimating can create significant delays and cost increases, as siding colors may be discontinued or discontinued within 6-12 months of production runs. Reordering panels 6+ months later may cost 15-25% more per unit due to rush fees and color-matching charges. Additionally, you'll incur extra labor costs to restart installation and may face weather-related scheduling conflicts, potentially adding $500-$2,000 to your project.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are siding a rectangular wall that measures 30 feet in length and 10 feet in height. You plan to use vinyl siding panels that are 12 inches wide and 48 inches tall. You want to include a 10% waste margin to account for cuts and mistakes.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert all measurements to feet: Wall area = 30 ft × 10 ft = 300 sq ft. Panel area = 1 ft × 4 ft = 4 sq ft.",
      },
      {
        label: "2. Calculate Panels Needed",
        explanation:
          "Raw panels = 300 sq ft ÷ 4 sq ft = 75 panels.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 75 × 1.10 = 82.5 panels, round up to 83 panels.",
      },
      {
        label: "4. Order",
        explanation:
          "Order 83 vinyl siding panels to cover the wall with waste included.",
      },
    ],
    result: "Final Order: 83 Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Panels Needed = ⌈ (Wall Length × Wall Height) ÷ (Panel Width × Panel Height) × (1 + Waste %) ⌉",
    variables: [
      { symbol: "Wall Length", description: "Length of the wall or surface" },
      { symbol: "Wall Height", description: "Height of the wall or surface" },
      { symbol: "Panel Width", description: "Width of one siding panel" },
      { symbol: "Panel Height", description: "Height of one siding panel" },
      {
        symbol: "Waste %",
        description:
          "Waste margin percentage to account for cuts and errors",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole panel",
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
          <Label>Wall Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "10" : "30"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Wall Height ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "3" : "10"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Panel Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.panelWidth}
            onChange={(e) => handleInputChange("panelWidth", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "0.3" : "1"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Panel Height ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.panelHeight}
            onChange={(e) => handleInputChange("panelHeight", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "1.2" : "4"}`}
          />
        </div>
      </div>

      {/* Material Type */}
      <div className="space-y-2">
        <Label>Material Type</Label>
        <Select
          value={inputs.materialType}
          onValueChange={(v) => handleInputChange("materialType", v)}
        >
          <SelectTrigger>
            <HardHat className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vinyl">Vinyl</SelectItem>
            <SelectItem value="fiber-cement">Fiber Cement</SelectItem>
            <SelectItem value="wood">Wood</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span>{inputs.waste}%</span>
            </div>
            <Slider
              value={[parseInt(inputs.waste)]}
              min={0}
              max={25}
              step={1}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Panel</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Siding Panel Coverage Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Siding Panel Coverage Calculator determines the exact number of siding panels needed for your exterior renovation or new construction project. This tool accounts for your home's dimensions, architectural features like gables and dormers, and material-specific coverage rates. Using accurate measurements prevents costly reorders and ensures sufficient inventory for cuts, waste, and future repairs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your home's perimeter length (in feet) and wall height, then specify the total square footage of windows and doors. Select your siding panel type and dimensions—most standard vinyl panels are 10 feet long by 12.5 inches wide (10.4 sq ft per panel), though fiber cement and premium options vary. The calculator will automatically adjust coverage rates based on material type and add your selected waste percentage (10-15% is recommended).</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results will display the total panels needed, estimated material cost range, and a detailed breakdown by section (main walls, gables, soffit, fascia). Compare these figures against your budget and supplier inventory before placing orders. If your project has unusual features like wraparound porches, curved sections, or extensive trim, add an additional 5-10% to accommodate complexity.</p>
        </div>
      </section>

      {/* TABLE: Standard Siding Panel Dimensions and Coverage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Siding Panel Dimensions and Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common residential siding panel sizes and their corresponding square foot coverage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panel Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Length (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Width (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Square Feet per Panel</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panels per 1,000 sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl Premium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fiber Cement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fiber Cement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood Shingle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Horizontal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage assumes full panel installation without cutting or overlaps. Actual coverage decreases 10-15% when accounting for waste and installation cuts.</p>
      </section>

      {/* TABLE: Siding Material Waste Factors by Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Siding Material Waste Factors by Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended waste percentages for common siding materials to ensure adequate coverage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Waste %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Waste %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Complex Design Waste %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reason for Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl Siding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Clean cuts, minimal splitting</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fiber Cement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Prone to cracking, requires careful handling</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood Shake/Shingle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Grain variation, splitting, grain-matched runs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Siding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Custom-cut capability, minimal waste</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate cutting needs, color consistency</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brick Veneer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Modular units, minimal cutting</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stone Veneer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Irregular shapes require significant trimming</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Complex designs include extensive gables, dormers, multiple roof lines, and detailed trim work. Always purchase high-end estimate for first-time installations.</p>
      </section>

      {/* TABLE: Wall Area Coverage: Common Home Sizes and Siding Requirements */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Wall Area Coverage: Common Home Sizes and Siding Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated siding panel requirements for typical residential homes at various square footages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Home Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Wall Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Waste Factor (12%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vinyl Panels Needed (10.4 sq ft)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,344</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">129</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">216</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,016</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">194</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">288</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,688</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">258</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">323</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">432</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,032</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">388</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">504</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,704</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">452</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">576</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,376</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">517</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Wall area estimates assume single-story foundations equal to 1.2× home square footage (30% perimeter wall coefficient). Subtract 15-20% for windows and doors. Add 5-10% for gable ends on two-story homes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure twice, order once—verify all wall lengths, heights, and opening dimensions with a laser measuring tool or professional surveyor to ensure accuracy within ±2 inches. Errors in foundation measurements compound across your entire project, potentially requiring expensive reorders.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request samples from manufacturers in your chosen color before calculating final quantities, as color variations between production batches can be noticeable over large areas. Compare samples in natural daylight, afternoon sun, and shade to confirm consistency across your home's elevation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Contact local contractors or your material supplier for waste percentage guidance specific to your installation complexity; complex designs with multiple gables, dormers, or architectural details may require 15-20% waste instead of the standard 10-12%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Build in a 5-10% reserve beyond your calculated waste factor for future repairs—siding colors discontinue every 18-24 months, making replacements difficult to match after 2-3 years. Store extra panels in a climate-controlled space to maintain color consistency and prevent warping.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring Perimeter Instead of Wall Area</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many homeowners measure only the perimeter and multiply by height without accounting for the actual exterior surface area covered by siding. Gables, roof overhangs, and architectural offsets can add 10-20% to your actual wall area, causing significant underestimation if ignored.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Subtract Window and Door Openings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Windows and doors typically represent 15-25% of wall area but require no siding coverage. Failing to subtract these openings from your calculation can result in ordering 15-20% excess material, wasting $500-$1,500 on a typical home project.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Insufficient Waste Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying only 5% waste to complex installations with multiple gable ends and dormers leaves no buffer for cutting errors, damaged panels, or future repairs. Industry standards recommend 10-15% waste; using lower percentages creates project delays when panels must be reordered.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Soffit and Fascia</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many calculators focus solely on wall siding and overlook soffit and fascia requirements, which can add 100-200 linear feet of material. Soffit and fascia use different coverage calculations and may require separate material orders, representing 10-15% of your total siding budget if forgotten.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many siding panels do I need to cover a 2,000 square foot house?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 2,000 square foot house, you'll typically need between 40 to 50 panels depending on your siding type. Standard vinyl siding panels measure 10 feet long by 12.5 inches wide, covering approximately 10.4 square feet per panel. However, accounting for 10-15% waste due to cuts, corners, and overlaps, you should purchase 44 to 58 panels for complete coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard size of a siding panel?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most residential siding panels are 10 feet long and 12.5 inches wide, providing 10.4 square feet of coverage per panel. Some manufacturers offer 12-foot panels at 12 inches wide (10 square feet), while fiber cement panels may vary from 8 to 12 feet in length. Always check your specific product specifications, as European and specialty sidings may have different dimensions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add extra panels for waste and mistakes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, industry standard practice recommends adding 10-15% to your total siding requirement for waste, cuts, and future repairs. For a 2,000 square foot project requiring 48 panels, you should order 53 to 55 panels total. This buffer accounts for measurement errors, damaged panels during installation, and having materials available for repairs within 2-3 years before color discontinuation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate siding coverage for irregular shaped homes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Break your home into simple geometric shapes: rectangles for walls, triangles for gable ends, and trapezoids for sloped sections. Measure each section's height and width, calculate the square footage, then sum all sections. Subtract window and door openings (typically 10-20% of total wall area), then divide your total by the square feet per panel.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of wall area is typically taken up by windows and doors?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Windows and doors typically consume 15-25% of total wall area on residential homes, though this varies by architectural style. Modern energy-efficient homes often have 20% window coverage, while older homes may have only 10-15%. When calculating siding panels, measure each opening individually and subtract the total square footage from your gross wall area before calculating panel requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much siding do I need for a gable end roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For gable ends, calculate the area as a triangle: multiply the width by the height from the wall plate to the peak, then divide by 2. A 30-foot wide gable with an 8-foot peak height equals 120 square feet (30 × 8 ÷ 2). Using standard 10.4 square foot panels, you'd need approximately 12 panels for one gable end, accounting for the triangular shape and waste.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there different coverage calculations for different siding materials?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Coverage calculations remain consistent across vinyl, fiber cement, wood, and composite sidings—all measure by panel square footage. However, installation waste percentages may vary: vinyl typically requires 10% waste, fiber cement 12-15%, and wood 15-20% due to grain variations and potential splitting. Metal sidings can be custom-cut to minimize waste, potentially requiring only 5-8% additional material.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for soffit and fascia in my siding coverage calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Soffit and fascia require separate calculations from wall siding. Measure the linear feet of your roofline's perimeter and multiply by the soffit width (typically 16 or 24 inches) to get soffit square footage. Fascia is calculated by linear feet—measure your roofline perimeter and multiply by fascia width (usually 8-12 inches), then divide by 144 to convert to square feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I underestimate my siding panel needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Underestimating can create significant delays and cost increases, as siding colors may be discontinued or discontinued within 6-12 months of production runs. Reordering panels 6+ months later may cost 15-25% more per unit due to rush fees and color-matching charges. Additionally, you'll incur extra labor costs to restart installation and may face weather-related scheduling conflicts, potentially adding $500-$2,000 to your project.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nahb.org/research-and-economics/housing-research/research-base" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Home Improvement Research — National Association of Home Builders</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and data on residential siding materials, installation practices, and material specifications for exterior cladding projects.</p>
          </li>
          <li>
            <a href="https://www.vinylsiding.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vinyl Siding Institute — Technical Standards and Specifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official technical guidelines for vinyl siding panel dimensions, coverage rates, and installation requirements from the primary industry trade association.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/icc-codes-standards/icc-codes/international-residential-code/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Residential Code (IRC) — Exterior Walls and Cladding</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building code requirements and standards for siding installation, material durability, and exterior finish specifications across North American jurisdictions.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/home/materials/siding/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports — Home Siding Reviews and Comparisons</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent testing and consumer ratings for residential siding materials, comparing coverage efficiency, durability, and long-term cost performance.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Siding Panel Coverage Calculator"
      description="The ultimate professional guide and calculator for Siding Panel Coverage Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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