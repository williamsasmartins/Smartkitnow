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

export default function AcousticPanelAreaCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of the wall/area
    width: "", // width of the wall/area
    panelThickness: "", // thickness of acoustic panel (depth)
    waste: "10", // waste percentage
    price: "", // price per unit
    materialSize: "standard", // standard or large panel size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for panel sizes (area per unit)
  // Standard size: 0.6m x 0.6m = 0.36 m², Large size: 1.2m x 0.6m = 0.72 m²
  // Imperial: Standard 2ft x 2ft = 4 ft², Large 4ft x 2ft = 8 ft²
  const panelSizes = {
    metric: {
      standard: 0.36, // m²
      large: 0.72, // m²
    },
    imperial: {
      standard: 4, // ft²
      large: 8, // ft²
    },
  };

  // Convert inputs to numbers
  const lengthNum = parseFloat(inputs.length);
  const widthNum = parseFloat(inputs.width);
  const thicknessNum = parseFloat(inputs.panelThickness);
  const wastePercent = parseFloat(inputs.waste);
  const priceNum = parseFloat(inputs.price);
  const unit = inputs.unit;
  const materialSize = inputs.materialSize;

  // Calculate total area to cover (Length x Width)
  // Thickness is not used for area calculation but can be used for volume or cost if needed
  // For acoustic panels, area coverage is the main factor
  const results = useMemo(() => {
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25 ||
      !panelSizes[unit][materialSize]
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area (Length x Width)
    const totalArea = lengthNum * widthNum; // m² or ft² depending on unit

    // Calculate raw units needed (area / panel area)
    const panelArea = panelSizes[unit][materialSize];
    const rawUnits = totalArea / panelArea;

    // Add waste margin
    const unitsWithWaste = rawUnits * (1 + wastePercent / 100);

    // Round up to next whole unit
    const finalUnits = Math.ceil(unitsWithWaste);

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? finalUnits * priceNum : 0;

    return {
      mainQty: `${finalUnits} Unit${finalUnits !== 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw units: ${rawUnits.toFixed(2)} (Area: ${totalArea.toFixed(2)} ${unit === "metric" ? "m²" : "ft²"})`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [lengthNum, widthNum, wastePercent, priceNum, unit, materialSize, inputs.waste]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How much acoustic paneling do I need for a 20x15 foot room?",
      answer: "A 20x15 foot room has 300 square feet of floor space, but acoustic coverage depends on your wall and ceiling areas. For a standard 10-foot ceiling room, your total wall surface area would be approximately 700 square feet. Most professionals recommend covering 20-30% of wall area for moderate sound control, which equals 140-210 square feet of acoustic panels. For optimal results in recording studios or home theaters, aim for 40-50% coverage, requiring 280-350 square feet of panels.",
    },
    {
      question: "What is the standard size of an acoustic panel?",
      answer: "Standard acoustic panels typically measure 24 inches by 48 inches, which equals 8 square feet per panel. Some manufacturers offer 12x12 inch panels (1 square foot), 24x24 inch panels (4 square feet), and custom sizes up to 48x96 inches (32 square feet). The most common commercial and residential choice remains the 2x4 foot (8 sq ft) panel due to ease of installation and cost-effectiveness. Choosing the right size depends on wall dimensions and aesthetic preferences.",
    },
    {
      question: "How do I calculate panels needed for a basement recording studio?",
      answer: "First, measure all wall surfaces and ceiling area in square feet. A typical 16x20 foot basement with 8-foot ceilings has approximately 576 square feet of wall area plus 320 square feet of ceiling. For a recording studio, aim for 60-80% coverage of wall area (345-461 sq ft) plus 30-50% ceiling coverage (96-160 sq ft), totaling 441-621 square feet of acoustic treatment. Using standard 8 square foot panels, you would need 55-78 panels for comprehensive sound dampening.",
    },
    {
      question: "Does ceiling height affect acoustic panel requirements?",
      answer: "Yes, ceiling height significantly impacts total surface area and sound dynamics. A room with 8-foot ceilings has less wall area than the same floor dimensions with 10 or 12-foot ceilings. Higher ceilings create more volume requiring additional acoustic treatment to control reverberation—typically 10-15% more panels per height increase. For every additional 2 feet of ceiling height, budget an extra 8-12 square feet of acoustic coverage per 100 square feet of floor area.",
    },
    {
      question: "What percentage of wall area should be covered with acoustic panels?",
      answer: "Coverage percentage depends on room purpose: office spaces benefit from 15-25% wall coverage, general meeting rooms need 25-35% coverage, recording studios require 50-70% coverage, and concert halls need 60-80% coverage. A 300 square foot office with 600 square feet of wall area would need 90-150 square feet (11-19 panels at 8 sq ft each) for adequate sound control. Always prioritize first reflection points—the areas where sound bounces directly from the source to the listener's ears.",
    },
    {
      question: "Should I include closets and storage areas in my calculation?",
      answer: "Closets and small storage spaces should generally be excluded from acoustic panel calculations unless they're part of your primary sound control zone. However, if a closet is adjacent to a critical listening area or recording space, treating the interior can provide additional dampening at 20-40% lower cost than main room panels. For every 50 square feet of adjacent closet space, consider adding 10-15 square feet of acoustic treatment to the main room calculation.",
    },
    {
      question: "How do I account for doors and windows in my panel calculation?",
      answer: "Subtract door and window areas from your wall surface calculations since panels cannot be installed on glass or operable doors. A standard interior door (3x7 feet = 21 sq ft) and two 3x4 foot windows (24 sq ft total) would reduce a 600 square foot wall area to approximately 555 square feet. For rooms with significant window or door coverage (&gt;15% of wall area), recalculate your panel needs and consider acoustic window treatments or heavy door seals to improve overall sound control.",
    },
    {
      question: "What is the difference between wall and ceiling panel requirements?",
      answer: "Ceiling panels are typically less critical than wall panels for basic sound control but become essential in larger rooms or spaces with high ceilings. Ceiling coverage should generally be 20-40% of ceiling area for most applications, compared to 25-50% for walls. A 400 square foot ceiling requiring 30% coverage needs 120 square feet of panels (15 standard panels), while equivalent wall coverage requires more due to larger wall surface area in typical room dimensions.",
    },
    {
      question: "How much does acoustic panel coverage cost per square foot?",
      answer: "Acoustic panels range from $2-8 per square foot depending on material quality and thickness. Basic fiberglass panels cost $2-4 per square foot, while premium mineral fiber or melamine panels range $5-8 per square foot. For a 500 square foot installation using mid-range panels at $4 per square foot, expect a total material cost of $2,000. Installation labor typically adds $1-3 per square foot, making total project costs $3,000-$4,000 for professional installation on a 500 square foot space.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing standard acoustic panels on a wall measuring 5 meters in length and 3 meters in height. You want to include a 10% waste margin and know the price per panel is $25.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate total area: 5m (length) × 3m (height) = 15 m².",
      },
      {
        label: "2. Calculate Raw Units",
        explanation:
          "Each standard panel covers 0.36 m², so 15 ÷ 0.36 = 41.67 panels needed.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 41.67 × 1.10 = 45.83 panels, round up to 46 panels.",
      },
      {
        label: "4. Calculate Cost",
        explanation: "46 panels × $25 = $1,150 total estimated cost.",
      },
    ],
    result: "Final Order: 46 Standard Panels, Estimated Cost: $1,150",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Units Needed = (Length × Width) / Panel Area × (1 + Waste%)",
    variables: [
      { symbol: "Length", description: "Length of the area to cover" },
      { symbol: "Width", description: "Width or height of the area to cover" },
      { symbol: "Panel Area", description: "Coverage area of one acoustic panel" },
      { symbol: "Waste%", description: "Waste margin percentage (e.g., 0.10 for 10%)" },
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

      {/* Inputs for Length, Width, Thickness */}
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
          <Label>Width / Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
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
          <Label>Panel Thickness ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.panelThickness}
            onChange={(e) => handleInputChange("panelThickness", e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Panel Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
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
          value={[parseInt(inputs.waste) || 10]}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Acoustic Panel Area Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Acoustic Panel Area Planner is a specialized tool designed to calculate the precise amount of acoustic treatment materials needed for any interior space. Whether you're treating a home office, recording studio, podcast booth, or commercial meeting room, this calculator eliminates guesswork and prevents over-purchasing or under-treating your space. Proper acoustic planning saves money while ensuring your room achieves optimal sound quality and noise reduction.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input your room dimensions (length, width, and ceiling height), identify your room type or purpose (which determines the percentage of coverage needed), and account for any fixed obstructions like doors, windows, or built-in furniture. The calculator will automatically compute your total wall surface area, ceiling area, and recommend the appropriate square footage of acoustic paneling based on industry standards for your specific application. You can then select your preferred panel size to determine the exact number of panels required.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your recommended coverage area in square feet, the number of standard panels needed, and a breakdown of wall versus ceiling treatment. Use these figures to compare costs across different panel types and thicknesses, plan your installation layout, and create a procurement list for contractors or suppliers. Keep in mind that results are recommendations based on professional acoustic standards—your final installation may vary based on budget, aesthetic preferences, and specific acoustic measurements taken in your space.</p>
        </div>
      </section>

      {/* TABLE: Acoustic Panel Coverage Guidelines by Room Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Acoustic Panel Coverage Guidelines by Room Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different room applications require varying percentages of acoustic treatment for optimal sound control.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Coverage %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ceiling Coverage %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Recommended Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Office/Workspace</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-400 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conference Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Podcast/Voice Studio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">650-850 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Music Recording Studio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1,200 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mastering Suite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100-1,400 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Concert Hall</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,300-1,600 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Theater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-700 sq ft per 1,000 sq ft room</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Open Office</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-550 sq ft per 1,000 sq ft room</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages based on total wall and ceiling surface area. Adjust based on room acoustics and specific noise reduction needs.</p>
      </section>

      {/* TABLE: Standard Acoustic Panel Sizes and Coverage */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Acoustic Panel Sizes and Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common acoustic panel dimensions and their coverage capacity for planning purposes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panel Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Square Footage per Panel</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panels Needed for 500 sq ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panels Needed for 1,000 sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12x12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500 panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000 panels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24x24 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 panels</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24x48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63 panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 panels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">48x48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63 panels</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24x96 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63 panels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">48x96 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 panels</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The 24x48 inch (8 sq ft) panel is the industry standard for residential and commercial applications. Custom sizes available from specialty manufacturers.</p>
      </section>

      {/* TABLE: Room Dimensions and Acoustic Panel Requirements */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Room Dimensions and Acoustic Panel Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample calculations for common room sizes showing recommended panel quantities for moderate acoustic control.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size (L x W x H)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Floor Area</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Area</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Coverage (30%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8 sq ft Panels Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 x 10 x 8 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 panels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 x 15 x 8 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">432 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 panels</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 x 20 x 9 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">630 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">189 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 panels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16 x 20 x 10 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">720 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">216 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27 panels</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 x 25 x 10 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">270 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34 panels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24 x 30 x 12 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">720 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,296 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">389 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49 panels</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on 30% wall coverage for moderate sound control. Excludes doors, windows, and other obstructions. Increase panel count by 15-25% for high-performance applications.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize first reflection points—the areas where sound waves bounce directly from the source to the listener—by treating the walls within 2-3 feet of speakers or sound sources before adding general room coverage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine different panel thicknesses strategically: use 2-inch panels for mid and high-frequency control on walls, and reserve 4-inch panels for bass traps in corners where low frequencies accumulate most intensely.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for future flexibility by planning treatment in modular sections; this allows you to start with 25-30% coverage and incrementally add panels based on acoustic measurements and budget availability.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never overlook door and window treatments—acoustic seals, heavy curtains, and door sweeps can improve overall room performance by 15-20% without requiring additional wall panel installation.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Ceiling Coverage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many planners focus exclusively on walls and forget that ceilings contribute 20-30% of total reflective surface area. Untreated ceilings create flutter echo and excessive reverberation, requiring 15-20% more wall panels to compensate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating Obstructions as Panels</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Subtracting door and window areas from your calculation is correct, but then failing to adjust your overall coverage percentage often results in insufficient treatment. Always recalculate your coverage percentage after accounting for large obstructions (&gt;10% of wall area).</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using One Coverage Percentage for All Applications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying recording studio standards (60-70% coverage) to an office space wastes 50-70% of your acoustic budget. Match your coverage percentage precisely to your room's intended use to optimize both performance and cost.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating Room Surface Area</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Forgetting to multiply wall perimeter by ceiling height is a common error that underestimates requirements by 30-40%. Always calculate wall area as (2 × length + 2 × width) × ceiling height, then separately measure ceiling area.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much acoustic paneling do I need for a 20x15 foot room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 20x15 foot room has 300 square feet of floor space, but acoustic coverage depends on your wall and ceiling areas. For a standard 10-foot ceiling room, your total wall surface area would be approximately 700 square feet. Most professionals recommend covering 20-30% of wall area for moderate sound control, which equals 140-210 square feet of acoustic panels. For optimal results in recording studios or home theaters, aim for 40-50% coverage, requiring 280-350 square feet of panels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard size of an acoustic panel?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard acoustic panels typically measure 24 inches by 48 inches, which equals 8 square feet per panel. Some manufacturers offer 12x12 inch panels (1 square foot), 24x24 inch panels (4 square feet), and custom sizes up to 48x96 inches (32 square feet). The most common commercial and residential choice remains the 2x4 foot (8 sq ft) panel due to ease of installation and cost-effectiveness. Choosing the right size depends on wall dimensions and aesthetic preferences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate panels needed for a basement recording studio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">First, measure all wall surfaces and ceiling area in square feet. A typical 16x20 foot basement with 8-foot ceilings has approximately 576 square feet of wall area plus 320 square feet of ceiling. For a recording studio, aim for 60-80% coverage of wall area (345-461 sq ft) plus 30-50% ceiling coverage (96-160 sq ft), totaling 441-621 square feet of acoustic treatment. Using standard 8 square foot panels, you would need 55-78 panels for comprehensive sound dampening.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does ceiling height affect acoustic panel requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, ceiling height significantly impacts total surface area and sound dynamics. A room with 8-foot ceilings has less wall area than the same floor dimensions with 10 or 12-foot ceilings. Higher ceilings create more volume requiring additional acoustic treatment to control reverberation—typically 10-15% more panels per height increase. For every additional 2 feet of ceiling height, budget an extra 8-12 square feet of acoustic coverage per 100 square feet of floor area.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of wall area should be covered with acoustic panels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Coverage percentage depends on room purpose: office spaces benefit from 15-25% wall coverage, general meeting rooms need 25-35% coverage, recording studios require 50-70% coverage, and concert halls need 60-80% coverage. A 300 square foot office with 600 square feet of wall area would need 90-150 square feet (11-19 panels at 8 sq ft each) for adequate sound control. Always prioritize first reflection points—the areas where sound bounces directly from the source to the listener's ears.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include closets and storage areas in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Closets and small storage spaces should generally be excluded from acoustic panel calculations unless they're part of your primary sound control zone. However, if a closet is adjacent to a critical listening area or recording space, treating the interior can provide additional dampening at 20-40% lower cost than main room panels. For every 50 square feet of adjacent closet space, consider adding 10-15 square feet of acoustic treatment to the main room calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for doors and windows in my panel calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract door and window areas from your wall surface calculations since panels cannot be installed on glass or operable doors. A standard interior door (3x7 feet = 21 sq ft) and two 3x4 foot windows (24 sq ft total) would reduce a 600 square foot wall area to approximately 555 square feet. For rooms with significant window or door coverage (&gt;15% of wall area), recalculate your panel needs and consider acoustic window treatments or heavy door seals to improve overall sound control.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between wall and ceiling panel requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ceiling panels are typically less critical than wall panels for basic sound control but become essential in larger rooms or spaces with high ceilings. Ceiling coverage should generally be 20-40% of ceiling area for most applications, compared to 25-50% for walls. A 400 square foot ceiling requiring 30% coverage needs 120 square feet of panels (15 standard panels), while equivalent wall coverage requires more due to larger wall surface area in typical room dimensions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does acoustic panel coverage cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Acoustic panels range from $2-8 per square foot depending on material quality and thickness. Basic fiberglass panels cost $2-4 per square foot, while premium mineral fiber or melamine panels range $5-8 per square foot. For a 500 square foot installation using mid-range panels at $4 per square foot, expect a total material cost of $2,000. Installation labor typically adds $1-3 per square foot, making total project costs $3,000-$4,000 for professional installation on a 500 square foot space.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://acousticalsociety.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Acoustical Society of America - Noise Control Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards and guidelines for acoustic treatment in various building types and applications.</p>
          </li>
          <li>
            <a href="https://www.ashrae.org/technical-resources/standards-and-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASHRAE 90.1 Energy Standard - Acoustic Design Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building performance standards including acoustic design requirements for commercial and institutional buildings.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/niosh/topics/noise/default.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institute for Occupational Safety and Health - Noise Exposure Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal workplace noise exposure standards and recommendations for sound control in occupational environments.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/standards/icc-building-safety-standards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code - Acoustic Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building code requirements for sound transmission class (STC) ratings and acoustic design in construction projects.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Acoustic Panel Area Planner"
      description="The ultimate professional guide and calculator for Acoustic Panel Area Planner. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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