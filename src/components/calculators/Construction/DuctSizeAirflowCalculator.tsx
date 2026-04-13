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

export default function DuctSizeAirflowCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = mm, m3/min; imperial = inches, cfm
    length: "", // duct length
    width: "", // duct width
    depth: "", // duct height/depth
    waste: "10", // waste margin %
    price: "", // price per unit material
    materialSize: "standard", // standard or large duct sheet size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert inputs to consistent units (meters for metric, feet for imperial)
   * 2. Calculate duct surface area (material needed) = perimeter * length
   *    Perimeter = 2*(width + depth)
   *    Length is duct run length
   * 3. Add waste margin
   * 4. Calculate material units needed based on sheet size (area per sheet)
   * 5. Calculate cost if price per unit given
   */

  const results = useMemo(() => {
    // Parse inputs
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
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
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Unit conversion factors
    // Metric inputs assumed in millimeters, convert to meters for area calculation
    // Imperial inputs assumed in inches, convert to feet
    let lengthM = 0,
      widthM = 0,
      depthM = 0;
    if (inputs.unit === "metric") {
      lengthM = lengthNum / 1000;
      widthM = widthNum / 1000;
      depthM = depthNum / 1000;
    } else {
      // imperial
      lengthM = lengthNum / 3.281; // feet to meters
      widthM = widthNum / 3.281;
      depthM = depthNum / 3.281;
    }

    // Calculate perimeter of duct cross-section (rectangle)
    const perimeter = 2 * (widthM + depthM); // meters

    // Surface area of duct material needed (side walls + top/bottom)
    // Assume duct is rectangular and open ends don't need material
    // Surface area = perimeter * length
    const surfaceArea = perimeter * lengthM; // m²

    // Add waste margin
    const surfaceAreaWithWaste = surfaceArea * (1 + wastePercent / 100);

    // Material sheet sizes (area per unit)
    // Standard size: 1.2m x 2.4m = 2.88 m²
    // Large size: 1.5m x 3.0m = 4.5 m²
    const sheetArea =
      inputs.materialSize === "large" ? 4.5 : 2.88; // m² per sheet

    // Calculate number of sheets needed (round up)
    const sheetsNeeded = Math.ceil(surfaceAreaWithWaste / sheetArea);

    // Calculate cost if price given
    const cost = priceNum && priceNum > 0 ? priceNum * sheetsNeeded : 0;

    return {
      mainQty: `${sheetsNeeded} Unit${sheetsNeeded > 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw Material Area: ${surfaceArea.toFixed(
        2
      )} m², with waste: ${surfaceAreaWithWaste.toFixed(2)} m²`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What airflow velocity should I use for residential ductwork?",
      answer: "For residential HVAC systems, recommended airflow velocity typically ranges from 600 to 900 feet per minute (FPM) in main ducts and 400 to 600 FPM in branch ducts. Velocities above 1,000 FPM can cause excessive noise and friction losses, while velocities below 400 FPM may result in inadequate air distribution and potential dust settling. Most residential systems operate optimally at 700-800 FPM in the main trunk.",
    },
    {
      question: "How do I calculate the required duct diameter for a specific CFM requirement?",
      answer: "Duct diameter can be calculated using the formula: Diameter = √(4 × CFM ÷ (π × Velocity)). For example, a 1,200 CFM system at 800 FPM velocity would require approximately a 4.2-inch diameter duct. Online calculators simplify this by accepting CFM and desired velocity, automatically computing the required round or rectangular duct dimensions to minimize pressure drop.",
    },
    {
      question: "What's the difference between round and rectangular ductwork?",
      answer: "Round ducts are more efficient, offering lower friction loss and better airflow velocity distribution, making them ideal for main trunks where space permits. Rectangular ducts fit better in confined spaces like between joists or in attics but experience higher friction loss due to greater surface area per unit volume. For the same CFM, round ducts typically require smaller cross-sectional areas and deliver superior performance.",
    },
    {
      question: "How does duct insulation affect airflow calculations?",
      answer: "Duct insulation itself does not directly affect airflow velocity or CFM calculations, but it reduces thermal losses and improves system efficiency. However, improperly installed insulation can obstruct airflow if it bulges into the duct interior, effectively reducing the duct's cross-sectional area and increasing velocity. Insulation R-values typically range from R-4 to R-8 for residential applications.",
    },
    {
      question: "What CFM capacity do I need for a typical 2,000 sq ft home?",
      answer: "A standard residential rule of thumb is 1 CFM per conditioned square foot, meaning a 2,000 sq ft home requires approximately 2,000 CFM capacity. However, this varies based on climate zone, insulation levels, and occupancy. High-performance or tight homes may require only 1,200-1,500 CFM, while older or warmer climates might need 2,200-2,500 CFM.",
    },
    {
      question: "How do friction losses impact duct sizing?",
      answer: "Friction loss increases as airflow velocity increases and as duct surface area increases, typically measured in inches of water column (IWC) per 100 feet of duct. A well-designed residential system should not exceed 0.10 IWC per 100 feet in main ducts. Undersizing ducts dramatically increases friction loss; a 3-inch duct carrying 1,000 CFM experiences roughly 3-4 times more friction loss than a properly sized 4.5-inch duct.",
    },
    {
      question: "What are minimum and maximum duct sizes for residential HVAC systems?",
      answer: "Residential ductwork typically ranges from 3 inches (minimum for branch runs) to 14 inches (maximum for main supply trunks) in diameter for round ducts. Rectangular equivalents might range from 3×6 inches to 10×20 inches. Ducts smaller than 3 inches create excessive velocity and noise, while oversizing beyond system requirements wastes materials and installation costs without performance benefits.",
    },
    {
      question: "How do I account for multiple branch ducts in my airflow calculations?",
      answer: "When designing a system with multiple branch ducts, the total CFM must be divided among branches proportionally based on their intended coverage area. For example, if three branch ducts serve equal zones in a 2,000 CFM system, each branch should ideally receive approximately 650-700 CFM. Use a duct calculator to size each branch individually, ensuring all branches maintain velocity within the 400-600 FPM range to prevent uneven distribution.",
    },
    {
      question: "What external factors should I consider when sizing ductwork?",
      answer: "Key factors include total duct length (longer runs require larger ducts to offset friction losses), number of elbows and fittings (each adds equivalent length), elevation changes, filter restrictions, and equipment specifications. A 50-foot duct run with four 90-degree elbows may require 15-20% larger sizing than a straight 50-foot run. Always consult your HVAC equipment's technical specifications for static pressure limits, typically 0.5-1.0 IWC for residential systems.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are fabricating a rectangular duct run that is 10 meters long, with a cross-section of 400 mm width and 300 mm depth. You want to order standard size galvanized steel sheets and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert dimensions to meters: Length = 10 m, Width = 0.4 m, Depth = 0.3 m. Calculate perimeter = 2 × (0.4 + 0.3) = 1.4 m.",
      },
      {
        label: "2. Calculate Surface Area",
        explanation:
          "Surface area = Perimeter × Length = 1.4 m × 10 m = 14 m².",
      },
      {
        label: "3. Add Waste Margin",
        explanation:
          "Add 10% waste: 14 m² × 1.10 = 15.4 m² total material needed.",
      },
      {
        label: "4. Determine Sheets Needed",
        explanation:
          "Standard sheet size = 2.88 m². Sheets needed = 15.4 ÷ 2.88 ≈ 5.35, round up to 6 sheets.",
      },
      {
        label: "5. Final Order",
        explanation: "Order 6 sheets of galvanized steel for the duct run.",
      },
    ],
    result: "Final Order: 6 Sheets",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Material Area = Perimeter × Length × (1 + Waste Margin)\nPerimeter = 2 × (Width + Depth)",
    variables: [
      { symbol: "L", description: "Length of the duct run" },
      { symbol: "W", description: "Width of the duct cross-section" },
      { symbol: "D", description: "Depth (height) of the duct cross-section" },
      { symbol: "Waste", description: "Waste margin percentage (decimal)" },
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
            <SelectItem value="metric">Metric (mm, m³/min)</SelectItem>
            <SelectItem value="imperial">Imperial (in, cfm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 10000"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 400"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Height ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 300"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (1.2m x 2.4m)</SelectItem>
              <SelectItem value="large">Large Size (1.5m x 3.0m)</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Duct Size & Airflow Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Duct Size & Airflow Calculator helps HVAC professionals, contractors, and homeowners determine the correct duct dimensions needed to deliver the required airflow volume (measured in CFM—cubic feet per minute) throughout a residential or commercial space. Properly sized ductwork is critical to system efficiency, comfort, and noise control; undersized ducts create excessive pressure drop and noise, while oversized ducts waste money and may result in poor air distribution.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires three key inputs: the desired airflow volume in CFM (based on the building's square footage and climate), the type of ductwork (round or rectangular), and the target airflow velocity in feet per minute (FPM). Velocity determines how fast air travels through the duct; residential main trunks typically operate at 700–900 FPM, while branch ducts should stay between 400–600 FPM to minimize noise. You may also input duct length and the number of fittings to account for friction losses.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs the required duct dimensions (diameter for round, width and height for rectangular), the resulting velocity, and the estimated friction loss in inches of water column per 100 feet. Compare these results against your HVAC equipment's static pressure rating (usually 0.5–1.0 IWC for residential units) to ensure your system can handle the calculated losses. If friction loss is excessive, the calculator suggests increasing duct size; if velocity is too high, reducing CFM or increasing duct size will help.</p>
        </div>
      </section>

      {/* TABLE: Standard Round Duct Sizing by CFM and Velocity */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Round Duct Sizing by CFM and Velocity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the required round duct diameter in inches for various CFM flows at recommended residential velocities.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">CFM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">600 FPM (Branch)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">700 FPM (Branch)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">800 FPM (Main)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">900 FPM (Main)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Diameters rounded to nearest 0.1 inch. Select velocity based on duct location: branch ducts typically use lower velocities to minimize noise; main trunks tolerate higher velocities.</p>
      </section>

      {/* TABLE: Friction Loss Reference for Round Ductwork */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Friction Loss Reference for Round Ductwork</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Friction loss in inches of water column per 100 feet of straight duct at various CFM levels and common duct sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duct Diameter (in.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1,000 CFM Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1,500 CFM Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2,000 CFM Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2,500 CFM Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.82 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.84 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.26 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.06 IWC</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.48 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.08 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.92 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.98 IWC</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.30 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.67 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.20 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.86 IWC</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.20 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.44 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.79 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.22 IWC</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.14 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.31 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.55 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.85 IWC</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.07 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.16 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.29 IWC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.45 IWC</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume smooth sheet metal ducts with minimal fittings. Flexible ducts typically increase friction loss by 20-40%. Total system static pressure limit for residential systems should not exceed 1.0 IWC.</p>
      </section>

      {/* TABLE: CFM Requirements by Home Size and Climate Zone */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">CFM Requirements by Home Size and Climate Zone</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended total HVAC system capacity based on conditioned square footage and climate severity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Home Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mild Climate (CFM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Climate (CFM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severe Climate (CFM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100-1,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200-1,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500-1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,650-1,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800-2,250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000-2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200-2,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400-3,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500-3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,750-3,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-3,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,300-3,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,600-4,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500-4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,850-4,550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,200-5,250</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Mild climates: average temps 55-75°F; Moderate: 45-85°F; Severe: &lt;45°F or &gt;85°F. These are baseline estimates; high-performance homes may use 10-20% less, while older homes may require 10-20% more.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your home's total CFM requirement before designing ductwork—use the 1 CFM per square foot rule as a baseline, then adjust up or down based on climate severity, insulation quality, and equipment specifications to avoid over- or under-sizing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Design main trunk ducts for 700–800 FPM and branch ducts for 400–600 FPM; this balance minimizes friction losses and noise while ensuring adequate velocity for proper air distribution to all rooms.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for all ductwork components when calculating friction loss, not just straight runs—each 90-degree elbow adds roughly 20–30 feet of equivalent length, and dampers, filters, and coil restrictions also increase static pressure demand.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use smooth sheet metal ducts instead of flexible ducts in main trunks whenever possible; flexible ducts increase friction loss by 20–40% and should be reserved for short, final branch runs to minimize pressure drop and energy waste.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Friction Loss and Static Pressure</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many installers size ducts based on CFM alone without calculating friction losses, resulting in systems that cannot deliver the designed airflow. Your blower motor has a maximum static pressure limit (typically 0.5–1.0 IWC for residential); exceeding this reduces CFM output and strains the equipment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Excessive Duct Velocity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Duct velocities above 1,000 FPM cause severe noise, dramatically increase friction loss, and waste blower energy. Branch ducts running at 800+ FPM will generate whistling and rushing sounds that homeowners find unacceptable.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Oversizing the Entire System</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Designing ductwork for 1.5× the calculated CFM requirement does not improve comfort and wastes installation cost, materials, and energy. Oversized systems short-cycle and fail to properly dehumidify, particularly in cooling applications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to Balance Multiple Branch Ducts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">When a main trunk splits into multiple branch runs without proper balancing dampers, high-velocity branches will steal airflow from lower-velocity branches, causing uneven temperature and comfort across the home.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What airflow velocity should I use for residential ductwork?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For residential HVAC systems, recommended airflow velocity typically ranges from 600 to 900 feet per minute (FPM) in main ducts and 400 to 600 FPM in branch ducts. Velocities above 1,000 FPM can cause excessive noise and friction losses, while velocities below 400 FPM may result in inadequate air distribution and potential dust settling. Most residential systems operate optimally at 700-800 FPM in the main trunk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the required duct diameter for a specific CFM requirement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Duct diameter can be calculated using the formula: Diameter = √(4 × CFM ÷ (π × Velocity)). For example, a 1,200 CFM system at 800 FPM velocity would require approximately a 4.2-inch diameter duct. Online calculators simplify this by accepting CFM and desired velocity, automatically computing the required round or rectangular duct dimensions to minimize pressure drop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between round and rectangular ductwork?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Round ducts are more efficient, offering lower friction loss and better airflow velocity distribution, making them ideal for main trunks where space permits. Rectangular ducts fit better in confined spaces like between joists or in attics but experience higher friction loss due to greater surface area per unit volume. For the same CFM, round ducts typically require smaller cross-sectional areas and deliver superior performance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does duct insulation affect airflow calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Duct insulation itself does not directly affect airflow velocity or CFM calculations, but it reduces thermal losses and improves system efficiency. However, improperly installed insulation can obstruct airflow if it bulges into the duct interior, effectively reducing the duct's cross-sectional area and increasing velocity. Insulation R-values typically range from R-4 to R-8 for residential applications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What CFM capacity do I need for a typical 2,000 sq ft home?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard residential rule of thumb is 1 CFM per conditioned square foot, meaning a 2,000 sq ft home requires approximately 2,000 CFM capacity. However, this varies based on climate zone, insulation levels, and occupancy. High-performance or tight homes may require only 1,200-1,500 CFM, while older or warmer climates might need 2,200-2,500 CFM.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do friction losses impact duct sizing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Friction loss increases as airflow velocity increases and as duct surface area increases, typically measured in inches of water column (IWC) per 100 feet of duct. A well-designed residential system should not exceed 0.10 IWC per 100 feet in main ducts. Undersizing ducts dramatically increases friction loss; a 3-inch duct carrying 1,000 CFM experiences roughly 3-4 times more friction loss than a properly sized 4.5-inch duct.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are minimum and maximum duct sizes for residential HVAC systems?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Residential ductwork typically ranges from 3 inches (minimum for branch runs) to 14 inches (maximum for main supply trunks) in diameter for round ducts. Rectangular equivalents might range from 3×6 inches to 10×20 inches. Ducts smaller than 3 inches create excessive velocity and noise, while oversizing beyond system requirements wastes materials and installation costs without performance benefits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for multiple branch ducts in my airflow calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">When designing a system with multiple branch ducts, the total CFM must be divided among branches proportionally based on their intended coverage area. For example, if three branch ducts serve equal zones in a 2,000 CFM system, each branch should ideally receive approximately 650-700 CFM. Use a duct calculator to size each branch individually, ensuring all branches maintain velocity within the 400-600 FPM range to prevent uneven distribution.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What external factors should I consider when sizing ductwork?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors include total duct length (longer runs require larger ducts to offset friction losses), number of elbows and fittings (each adds equivalent length), elevation changes, filter restrictions, and equipment specifications. A 50-foot duct run with four 90-degree elbows may require 15-20% larger sizing than a straight 50-foot run. Always consult your HVAC equipment's technical specifications for static pressure limits, typically 0.5-1.0 IWC for residential systems.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ashrae.org/technical-resources/standards-and-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASHRAE Standard 62.1 – Ventilation and Indoor Air Quality</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard for minimum ventilation and airflow requirements in residential and commercial buildings.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/indoor-air-quality" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Environmental Protection Agency – Indoor Air Quality Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidance on maintaining proper HVAC airflow and ductwork maintenance for indoor air quality.</p>
          </li>
          <li>
            <a href="https://www.smacna.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sheet Metal and Air Conditioning Contractors' National Association (SMACNA) Duct Design Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards for duct sizing, installation, and friction loss calculations used by HVAC contractors nationwide.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/iecc/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Energy Conservation Code (IECC) – Mechanical Systems Chapter</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building code requirements for HVAC system design, ductwork sizing, and energy efficiency standards applicable to most U.S. jurisdictions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Duct Size & Airflow Calculator"
      description="The ultimate professional guide and calculator for Duct Size & Airflow Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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